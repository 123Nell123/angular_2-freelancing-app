export class User {
  public _id: string;
  public email: string;
  public fullname: string;
  public location: string;
  public bio: string;
  public summary_bio: string;
  public projects_completed: number;
  public categories: any[];
  public myRating: any;
  public ratingCount: any;
  allow_gps: boolean;
  coordinate_latitude: number;
  coordinate_longitude: number;
  phone_number: string;
}
