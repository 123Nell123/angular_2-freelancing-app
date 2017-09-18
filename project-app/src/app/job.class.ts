export class Job_class {
  public _id: string;
  public job_id: string;
  public author: string;
  public author_phone_number: string;
  public authors_email: string;
  public title: string;
  public categorie: string;
  public description: string;
  public date_posted: Date;
  public expiration_date: Date;
  public job_date: Date;
  public location: string;
  public images: any[];
  public offers: any[];
  public finished: boolean;
  public payed: boolean;
  public allow_gps: boolean;
  public coordinate_latitude: number;
  public coordinate_longitude: number;
}
