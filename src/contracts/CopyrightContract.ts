/*
 * SPDX-License-Identifier: Apache-2.0
 */

import { Context, Contract, Info, Returns, Transaction } from 'fabric-contract-api';
import { Copyright } from '../assets/Copyright';

@Info({title: 'CopyrightContract', description: 'Copyright Contract' })
export class CopyrightContract extends Contract {
  private copyrightKey: string = 'COPYRIGHT';

  @Transaction(false)
  @Returns('boolean')
  public async copyrightExists(ctx: Context, copyrightId: string): Promise<boolean> {
    const ledgerKey = ctx.stub.createCompositeKey(this.copyrightKey, [copyrightId]);
    const buffer = await ctx.stub.getState(ledgerKey);
    return (!!buffer && buffer.length > 0);
  }

  @Transaction()
  public async createCopyright(
    ctx: Context, newCopyrightString: string
  ): Promise<void> {
    const newCopyrightObject: Copyright = JSON.parse(newCopyrightString);

    const exists = await this.copyrightExists(ctx, newCopyrightObject.id);
    if (exists) {
      throw new Error(`The Copyright ${newCopyrightObject.id} already exists`);
    }

    const ledgerKey = ctx.stub.createCompositeKey(this.copyrightKey, [newCopyrightObject.id]);
    const sender = ctx.clientIdentity.getID();

    const copyright = new Copyright(newCopyrightObject);
    copyright.creator = sender;

    const buffer = Buffer.from(JSON.stringify(copyright));
    await ctx.stub.putState(ledgerKey, buffer);
  }

  @Transaction(false)
  @Returns('Copyright')
  public async readCopyright(ctx: Context, copyrightId: string): Promise<Copyright> {
    const exists = await this.copyrightExists(ctx, copyrightId);
    if (!exists) {
      throw new Error(`The Copyright ${copyrightId} does not exist`);
    }

    const ledgerKey = ctx.stub.createCompositeKey(this.copyrightKey, [copyrightId]);
    const buffer = await ctx.stub.getState(ledgerKey);
    const copyright = JSON.parse(buffer.toString()) as Copyright;

    return copyright;
  }

  @Transaction(false)
  @Returns('Copyright[]')
  public async readAllCopyright(ctx: Context): Promise<Copyright[]> {
    const result: Copyright[] = [];
    const iterator = await ctx.stub.getStateByPartialCompositeKey(this.copyrightKey, []);

    let value = (await iterator.next()).value

    while(value) {
      const buffer = (value.getValue() as any).toBuffer();
      const copyright = JSON.parse(buffer.toString()) as Copyright;
      result.push(copyright);
      value = (await iterator.next()).value;
    }

    return result;
  }

  @Transaction()
  public async updateCopyright(
    ctx: Context, updatedCopyrightString: string
  ): Promise<void> {
    const updatedCopyrightObject: Copyright = JSON.parse(updatedCopyrightString);

    const exists = await this.copyrightExists(ctx, updatedCopyrightObject.id);
    if (!exists) {
      throw new Error(`The Copyright ${updatedCopyrightObject.id} does not exist`);
    }

    const existingCopyright = await this.readCopyright(ctx, updatedCopyrightObject.id);
    const sender = ctx.clientIdentity.getID();

    if (existingCopyright.creator !== sender) {
      throw new Error(`You are not Authorised to update Copyright ${updatedCopyrightObject.id}`);
    }

    const ledgerKey = ctx.stub.createCompositeKey(this.copyrightKey, [updatedCopyrightObject.id]);

    const copyright = new Copyright(updatedCopyrightObject);
    copyright.creator = sender;

    const buffer = Buffer.from(JSON.stringify(copyright));
    await ctx.stub.putState(ledgerKey, buffer);
  }

  @Transaction()
  public async deleteCopyright(ctx: Context, copyrightId: string): Promise<void> {
    const exists = await this.copyrightExists(ctx, copyrightId);
    if (!exists) {
      throw new Error(`The Copyright ${copyrightId} does not exist`);
    }

    const existingCopyright = await this.readCopyright(ctx, copyrightId);
    const sender = ctx.clientIdentity.getID();
    if (existingCopyright.creator !== sender) {
      throw new Error(`You are not Authorised to delete Copyright ${copyrightId}`);
    }

    const ledgerKey = ctx.stub.createCompositeKey(this.copyrightKey, [copyrightId]);
    await ctx.stub.deleteState(ledgerKey);
  }

}
