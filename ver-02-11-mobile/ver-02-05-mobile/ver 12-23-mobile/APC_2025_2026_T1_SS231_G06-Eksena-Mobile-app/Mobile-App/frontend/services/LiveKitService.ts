/**
 * LiveKit Service for E-KSENA
 * Handles token generation and room management for real-time video communication
 */

import { supabase } from './supabaseClient';

export interface LiveKitTokenResponse {
  token: string;
  error?: string;
}

export interface LiveKitRoomConfig {
  roomName: string;
  participantName: string;
  participantMetadata?: {
    phoneNumber?: string;
    incidentId?: string;
    role?: 'responder' | 'citizen';
  };
}

/**
 * Get LiveKit access token from Supabase Edge Function
 * @param roomName - The room name to join (e.g., 'incident-12345')
 * @param participantName - The participant's name/identifier
 * @returns Token for LiveKit connection
 */
export const getLiveKitToken = async (
  roomName: string,
  participantName: string
): Promise<LiveKitTokenResponse> => {
  try {
    console.log(`[LIVEKIT] Requesting token for room: ${roomName}, participant: ${participantName}`);

    const { data, error } = await supabase.functions.invoke('get-livekit-token', {
      body: {
        roomName,
        participantName,
      },
    });

    if (error) {
      console.error('[LIVEKIT] Error getting token:', error);
      return { token: '', error: error.message };
    }

    if (!data || !data.token) {
      console.error('[LIVEKIT] No token in response');
      return { token: '', error: 'No token received from server' };
    }

    console.log(`[LIVEKIT] Token received successfully for room: ${roomName}`);
    return { token: data.token };
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : 'Unknown error';
    console.error('[LIVEKIT] Exception getting token:', errorMessage);
    return { token: '', error: errorMessage };
  }
};

/**
 * Generate room name from incident
 * @param incidentId - The incident ID
 * @returns Formatted room name
 */
export const generateRoomName = (incidentId: string): string => {
  return `incident-${incidentId}`.replace(/[^a-zA-Z0-9-]/g, '');
};

/**
 * Validate LiveKit configuration
 * @returns Whether LiveKit is properly configured
 */
export const validateLiveKitConfig = (): boolean => {
  // This would check if LiveKit URL is configured
  const livekitUrl = process.env.EXPO_PUBLIC_LIVEKIT_URL;
  if (!livekitUrl) {
    console.warn('[LIVEKIT] EXPO_PUBLIC_LIVEKIT_URL is not configured');
    return false;
  }
  return true;
};

/**
 * Get LiveKit server URL
 * @returns The LiveKit server URL (e.g., wss://livekit.example.com)
 */
export const getLiveKitUrl = (): string => {
  const url = process.env.EXPO_PUBLIC_LIVEKIT_URL || 'wss://your-livekit-server.livekit.cloud';
  return url;
};

export default {
  getLiveKitToken,
  generateRoomName,
  validateLiveKitConfig,
  getLiveKitUrl,
};
