/**
 * ExploreScreen - SMS Emergency Report & Live Session
 * Allows citizens to report emergencies via SMS with automatic LiveKit session initiation
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
} from 'react-native';
import * as Location from 'expo-location';
import { supabase } from '../../services/supabaseClient';
import { getLiveKitToken, generateRoomName } from '../../services/LiveKitService';

interface Conversation {
  id: number;
  phone_number: string;
  last_message: string;
}

export default function ExploreScreen() {
  const [phone, setPhone] = useState<string>('');
  const [message, setMessage] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  const handleSaveSMS = async (phoneNumber: string, content: string): Promise<void> => {
    // Validate input
    if (!phoneNumber || !content) {
      Alert.alert('Error', 'Please fill in all fields.');
      return;
    }

    if (phoneNumber.trim().length < 7) {
      Alert.alert('Error', 'Please enter a valid phone number.');
      return;
    }

    setLoading(true);
    try {
      console.log('[EXPLORE] Starting SMS report process...');
      console.log(`[EXPLORE] Phone: ${phoneNumber}, Message: ${content}`);

      // Step 1: Request location permission
      console.log('[EXPLORE] Requesting location permission...');
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission Denied', 'Location is required to save reports.');
        setLoading(false);
        return;
      }

      // Get current location
      const location = await Location.getCurrentPositionAsync({});
      const latitude = location.coords.latitude;
      const longitude = location.coords.longitude;
      console.log(`[EXPLORE] Location obtained: ${latitude}, ${longitude}`);

      // Step 2: Find or create conversation in Supabase
      console.log('[EXPLORE] Finding or creating conversation...');
      const { data: conversation, error: convError } = await supabase
        .from('conversations')
        .upsert(
          {
            phone_number: phoneNumber.trim(),
            last_message: content,
          },
          { onConflict: 'phone_number' }
        )
        .select() as any;

      if (convError) {
        throw new Error(`Conversation error: ${convError.message}`);
      }

      if (!conversation || !conversation.data || conversation.data.length === 0) {
        throw new Error('Could not retrieve conversation data');
      }

      const conversationData = conversation.data[0];
      console.log(`[EXPLORE] Conversation created/updated: ${conversationData.id}`);

      // Step 3: Save the message with location
      console.log('[EXPLORE] Saving message...');
      const { error: msgError } = await supabase.from('messages').insert([
        {
          conversation_id: conversationData.id,
          content: content,
          sender: 'incoming',
          latitude: latitude,
          longitude: longitude,
          created_at: new Date().toISOString(),
        },
      ]);

      if (msgError) {
        throw new Error(`Message save error: ${msgError.message}`);
      }

      console.log('[EXPLORE] Message saved successfully');

      // Step 4: Request LiveKit token
      console.log('[EXPLORE] Requesting LiveKit token...');
      const roomName = generateRoomName(`emergency-${conversationData.id}`);
      const tokenResponse = await getLiveKitToken(roomName, phoneNumber.trim());

      if (tokenResponse.error) {
        throw new Error(`LiveKit token error: ${tokenResponse.error}`);
      }

      console.log('[EXPLORE] LiveKit token received successfully');

      // Success! Show confirmation
      Alert.alert(
        'Report Saved & Live Session Ready',
        `Conversation ID: ${conversationData.id}\n\nYour report has been saved and a live session is ready. Responders can now connect to assist you.`,
        [{ text: 'OK', onPress: () => clearForm() }]
      );

      // You can navigate to LiveStream screen here if you have one:
      // navigation.navigate('LiveStream', { 
      //   token: tokenResponse.token,
      //   roomName: roomName,
      //   participantName: phoneNumber 
      // });

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      console.error('[EXPLORE] Error:', errorMessage);
      Alert.alert('Error', `Failed to process report: ${errorMessage}`);
    } finally {
      setLoading(false);
    }
  };

  const clearForm = () => {
    setPhone('');
    setMessage('');
  };

  return (
    <ScrollView
      contentContainerStyle={styles.container}
      keyboardShouldPersistTaps="handled"
    >
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>📱 Emergency SMS Report</Text>
        <Text style={styles.subtitle}>
          Report an emergency via SMS and start a live session with responders
        </Text>
      </View>

      {/* Form */}
      <View style={styles.form}>
        {/* Phone Number Input */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Phone Number</Text>
          <TextInput
            placeholder="+1234567890"
            value={phone}
            onChangeText={setPhone}
            style={styles.input}
            keyboardType="phone-pad"
            editable={!loading}
            placeholderTextColor="#999"
          />
        </View>

        {/* Message Input */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Emergency Description</Text>
          <TextInput
            placeholder="Describe the emergency situation..."
            value={message}
            onChangeText={setMessage}
            multiline
            style={[styles.input, styles.messageInput]}
            editable={!loading}
            placeholderTextColor="#999"
          />
          <Text style={styles.charCount}>
            {message.length} characters
          </Text>
        </View>

        {/* Submit Button */}
        <TouchableOpacity
          style={[styles.button, loading && styles.buttonDisabled]}
          onPress={() => handleSaveSMS(phone, message)}
          disabled={loading}
        >
          {loading ? (
            <>
              <ActivityIndicator color="#fff" style={styles.spinner} />
              <Text style={styles.buttonText}>Processing...</Text>
            </>
          ) : (
            <>
              <Text style={styles.buttonText}>📡 Send Report & Start Live</Text>
            </>
          )}
        </TouchableOpacity>

        {/* Info Box */}
        <View style={styles.infoBox}>
          <Text style={styles.infoTitle}>ℹ️ How it Works:</Text>
          <Text style={styles.infoText}>
            1. Enter your phone number and describe the emergency
          </Text>
          <Text style={styles.infoText}>
            2. Your location will be captured automatically
          </Text>
          <Text style={styles.infoText}>
            3. A live session will be created for responders to connect
          </Text>
          <Text style={styles.infoText}>
            4. Responders can assist you in real-time via video/audio
          </Text>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  header: {
    marginBottom: 30,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#dc2626',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  form: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 12,
    borderRadius: 6,
    fontSize: 14,
    color: '#333',
    backgroundColor: '#fafafa',
  },
  messageInput: {
    height: 120,
    textAlignVertical: 'top',
  },
  charCount: {
    fontSize: 12,
    color: '#999',
    marginTop: 6,
    textAlign: 'right',
  },
  button: {
    backgroundColor: '#dc2626',
    paddingVertical: 14,
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    marginBottom: 20,
  },
  buttonDisabled: {
    backgroundColor: '#ccc',
    opacity: 0.7,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  spinner: {
    marginRight: 8,
  },
  infoBox: {
    backgroundColor: '#f0f9ff',
    borderLeftWidth: 4,
    borderLeftColor: '#0284c7',
    padding: 14,
    borderRadius: 4,
  },
  infoTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#0284c7',
    marginBottom: 8,
  },
  infoText: {
    fontSize: 13,
    color: '#333',
    marginBottom: 6,
    lineHeight: 18,
  },
});
