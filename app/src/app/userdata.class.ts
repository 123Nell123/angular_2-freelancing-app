import { subscribedCategorie_class } from './subscribed_categorie.class';

export class UserData {
  fullname: string;
  bio: string;
  summary_bio: string;
  location: string;
  legal_person: number;
  projects_completed: number;
  categories: [subscribedCategorie_class];
}
