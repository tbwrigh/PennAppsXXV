import { ApiClient } from "./ApiClient";
import MeetingInfo from "../types/MeetingInfo";

interface MeetingResponse {
    message: string,
    meeting_id: string|null
}

interface MeetingPutBody {
    meeting_id: string,
    name: string|null,
    description: string|null,
    days: string[]|null,
    start_time: string|null,
    end_time: string|null
}

export class MeetingClient extends ApiClient {
    private readonly endpoint = '/meeting';

    public async getMeetings(): Promise<MeetingInfo[]> {
        return this.fetchAuthenticated(this.endpoint, 'GET') as Promise<MeetingInfo[]>;
    }

    public async postMeeting(name: string, desc: string, days: string[], start: string, end: string): Promise<MeetingResponse> {
        const data = {
            name: name,
            description: desc,
            days: days,
            start_time: start,
            end_time: end
        }
        return this.fetchAuthenticated(this.endpoint, 'POST', data) as Promise<MeetingResponse>;
    }

    public async putMeeting(meeting_id: string, name?: string, desc?: string, days?: string[], start?: string, end?: string): Promise<MeetingResponse> {
        const data: MeetingPutBody = {
            meeting_id: meeting_id
        } as MeetingPutBody;
    
        if (name) data.name = name;
        if (desc) data.description = desc;
        if (days) data.days = days;
        if (start) data.start_time = start;
        if (end) data.end_time = end;
    
        return this.fetchAuthenticated(this.endpoint, 'PUT', data) as Promise<MeetingResponse>;
    }

    public async deleteMeeting(meeting_id: string): Promise<MeetingResponse> {
        const data = {
            meeting_id: meeting_id
        };
    
        return this.fetchAuthenticated(this.endpoint, 'DELETE', data) as Promise<MeetingResponse>;
    }
}