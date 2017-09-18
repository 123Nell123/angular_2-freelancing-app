export class Offer {
  price: number;
  author: string;
  author_id: string;
  accepted: boolean;
  offer_id: string;
  _id: string;
  payed: boolean;
  title: string;
  categorie: string;
  description: string;
  job_date: string;
  public images: any[];
  location: string;
  public allow_gps: boolean;
  public coordinate_latitude: number;
  public coordinate_longitude: number;
}
