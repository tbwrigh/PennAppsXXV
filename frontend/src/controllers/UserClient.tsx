import { ApiClient } from "./ApiClient";
import User from "../types/User";

export class UserClient extends ApiClient {
    private readonly endpoint = '/user';
  
    // Authenticated PUT method that only takes a username
    public async putUser(username: string, pfp_url: string): Promise<User> {
      const data = { username: username, profile_pic: pfp_url };
      return this.fetchAuthenticated(this.endpoint, 'PUT', data) as Promise<User>;
    }
  
    // Authenticated GET method to fetch the current user (getSelf)
    public async getSelf(): Promise<User> {
      return this.fetchAuthenticated(this.endpoint, 'GET') as Promise<User>;
    }
  
    // Unauthenticated GET method to fetch a public user by ID (getPublicUser)
    public async getPublicUser(id: string): Promise<User> {
      const queryParams = { user_id: id };
      return this.fetchUnauthenticated(this.endpoint, 'GET', null, queryParams) as Promise<User>;
    }

    public async getPublicUsers(): Promise<User[]> {
      return this.fetchUnauthenticated(this.endpoint, 'GET') as Promise<User[]>;
    }
  }
  