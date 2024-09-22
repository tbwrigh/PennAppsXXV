import { ApiClient } from "./ApiClient";
import Availability from "../types/Availability";

interface BasicResponse {
    message: string,
}


export class AvailabilityClient extends ApiClient {
    private readonly endpoint = '/availability';
  
    // Authenticated GET method to fetch the current user (getSelf)
    public async getAvailability(meeting_id: string): Promise<Availability[]> {
        const queryParams = {meeting_id: meeting_id};
        return this.fetchAuthenticated(this.endpoint, 'GET', null, queryParams) as Promise<Availability[]>;
    }

    // Authenticated PUT method that only takes a username
    public async sharedMeeting(meeting_id: string, day: string, start: string, end: string): Promise<BasicResponse> {
        const data = { 
            meeting_id: meeting_id,
            day: day,
            start_time: start,
            end_time: end
        };
        return this.fetchAuthenticated(this.endpoint, 'PUT', data) as Promise<BasicResponse>;
    }

    // Authenticated PUT method that only takes a username
    public async unshareMeeting(meeting_id: string, day: string, start: string, end: string): Promise<BasicResponse> {
        const data = { 
            meeting_id: meeting_id,
            day: day,
            start_time: start,
            end_time: end
        };
        return this.fetchAuthenticated(this.endpoint, 'DELETE', data) as Promise<BasicResponse>;
    }
}