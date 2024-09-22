import { ApiClient } from "./ApiClient";
import User from "../types/User";

interface SharingResponse {
    message: string,
}


export class SharingClient extends ApiClient {
    private readonly endpoint = '/sharing';
  
    // Authenticated GET method to fetch the current user (getSelf)
    public async getShares(meeting_id: string): Promise<User[]> {
        const queryParams = {meeting_id: meeting_id};
        return this.fetchAuthenticated(this.endpoint, 'GET', null, queryParams) as Promise<User[]>;
    }

    // Authenticated PUT method that only takes a username
    public async sharedMeeting(user_id: string, meeting_id: string): Promise<SharingResponse> {
        const data = { user_id: user_id, meeting_id: meeting_id };
        return this.fetchAuthenticated(this.endpoint, 'PUT', data) as Promise<SharingResponse>;
    }

    // Authenticated PUT method that only takes a username
    public async unshareMeeting(user_id: string, meeting_id: string): Promise<SharingResponse> {
        const data = { user_id: user_id, meeting_id: meeting_id };
        return this.fetchAuthenticated(this.endpoint, 'DELETE', data) as Promise<SharingResponse>;
    }
}