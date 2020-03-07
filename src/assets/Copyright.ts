import { Object, Property } from 'fabric-contract-api';

@Object()
export class Author {
  @Property('name', 'string')
  public name: string; // Name of Author

  @Property('contribution', 'string')
  public contribution: string; // Description of what an author did

  @Property('authorship', 'string')
  public authorship: string; // Whether the Author was Anonymous etc.

  @Property('dateOfBirth', 'string')
  public dateOfBirth: string; // Date of Birth of Author

  @Property('dateOfDeath', 'string')
  public dateOfDeath: string; // Date of Death if applicable

  @Property('nationality', 'string')
  public nationality: string; // Nationality of Author
}

@Object()
export class Copyright {
  @Property('id', 'string')
  public id: string; // Unique Identifier of copy right - used for retrieval from the Blockchain

  @Property('title', 'string')
  public title: string; // The title of this very Copyright

  @Property('altTitles', 'Array<string>')
  public altTitles: string[]; // Alternative titles for this Copyright

  @Property('contributions', 'Array<string>')
  public contributions: string[]; // Titles of other works this Copyright has contributed

  @Property('authors', 'Array<Author>')
  public authors: Author[]; // Details of all authors of the work

  @Property('creationDate', 'string')
  public creationDate: string; // Date Property was created

  @Property('publicationDate', 'string')
  public publicationDate: string; // Date Property was published

  @Property('creator', 'string')
  public creator: string; // Creator of this Copyright

  constructor(copyright: Copyright) {
    this.id = copyright.id;
    this.title = copyright.title;
    this.altTitles = copyright.altTitles;
    this.contributions = copyright.contributions;
    this.authors = copyright.authors;
    this.creationDate = copyright.creationDate;
    this.publicationDate = copyright.publicationDate;
    this.creator = copyright.creator;
  }
}