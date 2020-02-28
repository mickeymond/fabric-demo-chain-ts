import { Object, Property } from 'fabric-contract-api';

@Object()
export class Copyright {
  @Property()
  public id: string;

  @Property()
  public name: string;

  @Property()
  public owner: string;
}