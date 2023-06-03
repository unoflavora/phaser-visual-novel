
export interface Response<T> {
    data: T,
    meta: string,
    error: Error | null,
    message: string,
    statusCode: number;
}

export interface InitData 
{
    sessionId: string,
    savedData: string | null
}

export interface AuthData 
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
  