export interface AuthResponse {
    data: LoginData,
    meta: string,
    error: Error | null,
    message: string,
    statusCode: number;
}

export interface LoginData 
{
    id: string
    fullName: string
    token: string
    refreshToken: string
    tokenExpiredDate: string
    hasPlayed: boolean  
}

export interface Error {
    code: string
    message: string
    target: any
    details: any
    innererror: any
  }
  