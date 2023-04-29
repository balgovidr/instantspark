import { getFirestore, collection, doc, setDoc, addDoc, onSnapshot, docChanges, getDoc, updateDoc } from "firebase/firestore";
import { useRef, useState } from "react";
import app from "../../firebaseConfig";
import {Button, KeyboardAvoidingView, SafeAreaView, StyleSheet, TextInput, View} from 'react-native';
import {RTCPeerConnection, RTCIceCandidate, RTCSessionDescription, RTCView, MediaStream, mediaDevices} from 'react-native-webrtc';

export function Video () {

    const [remoteStream, setRemoteStream] = useState(null);
    const [localStream, setLocalStream] = useState(null);
    const [webcamStarted, setWebcamStarted] = useState(false);
    const [channelId, setChannelId] = useState(null);
    const pc = useRef();
    const db = getFirestore(app);

    const servers = {
    iceServers: [
        {
        urls: [
            'stun:stun1.l.google.com:19302',
            'stun:stun2.l.google.com:19302',
        ],
        },
    ],
    iceCandidatePoolSize: 10,
    };

    const startWebcam = async () => {
        pc.current = new RTCPeerConnection(servers);
        const local = await mediaDevices.getUserMedia({
        video: true,
        audio: true,
        });
        pc.current.addStream(local);
        setLocalStream(local);

        const remote = new MediaStream();
        setRemoteStream(remote);

        // Push tracks from local stream to peer connection
        local.getTracks().forEach(track => {
        pc.current.getLocalStreams()[0].addTrack(track);
        });

        // Pull tracks from peer connection, add to remote video stream
        pc.current.ontrack = event => {
        event.streams[0].getTracks().forEach(track => {
            remote.addTrack(track);
        });
        };

        pc.current.onaddstream = event => {
        setRemoteStream(event.stream);
        };
    };

    const startCall = async () => {
        const channelDoc = doc(collection(db, 'channels'));
        const offerCandidates = collection(channelDoc, 'offerCandidates');
        const answerCandidates = collection(channelDoc, 'answerCandidates');

        setChannelId(channelDoc.id);

        pc.current.onicecandidate = async event => {
        if (event.candidate) {
            await addDoc(offerCandidates, event.candidate.toJSON());
        }
        };

        //create offer
        const offerDescription = await pc.current.createOffer();
        await pc.current.setLocalDescription(offerDescription);

        const offer = {
        sdp: offerDescription.sdp,
        type: offerDescription.type,
        };

        await setDoc(channelDoc, {offer});

        // Listen for remote answer
        onSnapshot(channelDoc, snapshot => {
        const data = snapshot.data();
        if (!pc.current.currentRemoteDescription && data?.answer) {
            const answerDescription = new RTCSessionDescription(data.answer);
            pc.current.setRemoteDescription(answerDescription);
        }
        });

        // When answered, add candidate to peer connection
        onSnapshot(answerCandidates, snapshot => {
        snapshot.docChanges().forEach(change => {
            if (change.type === 'added') {
            const data = change.doc.data();
            pc.current.addIceCandidate(new RTCIceCandidate(data));
            }
        });
        });
    };

    const joinCall = async () => {
        const channelDoc = doc(db, 'channels', channelId);
        const offerCandidates = collection(channelDoc, 'offerCandidates');
        const answerCandidates = collection(channelDoc, 'answerCandidates');

        pc.current.onicecandidate = async event => {
        if (event.candidate) {
            await addDoc(answerCandidates, event.candidate.toJSON());
        }
        };

        const channelDocument = await getDoc(channelDoc);
        const channelData = channelDocument.data();

        const offerDescription = channelData.offer;

        await pc.current.setRemoteDescription(
        new RTCSessionDescription(offerDescription),
        );

        const answerDescription = await pc.current.createAnswer();
        await pc.current.setLocalDescription(answerDescription);

        const answer = {
        type: answerDescription.type,
        sdp: answerDescription.sdp,
        };

        await updateDoc(channelDoc, {answer});

        onSnapshot(offerCandidates, snapshot => {
        snapshot.docChanges().forEach(change => {
            if (change.type === 'added') {
            const data = change.doc.data();
            pc.current.addIceCandidate(new RTCIceCandidate(data));
            }
        });
        });
    };


    return(
        <KeyboardAvoidingView style={styles.body} behavior="position">
            <SafeAreaView>
            {localStream && (
                <RTCView
                streamURL={localStream?.toURL()}
                style={styles.stream}
                objectFit="cover"
                mirror
                />
            )}
    
            {remoteStream && (
                <RTCView
                streamURL={remoteStream?.toURL()}
                style={styles.stream}
                objectFit="cover"
                mirror
                />
            )}
            <View style={styles.buttons}>
                {!webcamStarted && (
                <Button title="Start webcam" onPress={startWebcam} />
                )}
                {webcamStarted && <Button title="Start call" onPress={startCall} />}
                {webcamStarted && (
                <View style={{flexDirection: 'row'}}>
                    <Button title="Join call" onPress={joinCall} />
                    <TextInput
                    value={channelId}
                    placeholder="callId"
                    minLength={45}
                    style={{borderWidth: 1, padding: 5}}
                    onChangeText={newText => setChannelId(newText)}
                    />
                </View>
                )}
            </View>
            </SafeAreaView>
        </KeyboardAvoidingView>
        )
}