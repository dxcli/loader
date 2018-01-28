import {IPlugin, read} from '@dxcli/config'
import {expect, fancy} from 'fancy-test'
import * as fs from 'fs-extra'
import * as path from 'path'

import {load} from '../src'

const loadPlugin = (root: string) => async (ctx: {plugin: IPlugin}) => {
  await reset(root)
  ctx.plugin = await load({root})
}

const reset = async (root: string) => {
  await fs.outputFile(path.join(root, '.git'), '')
  const config = await read({root})
  await fs.remove(config.cacheDir)
  await fs.remove(config.dataDir)
}

describe('hooks', () => {
  fancy
  .do(loadPlugin(path.join(__dirname, 'fixtures/typescript')))
  .stdout()
  .do(async ctx => {
    const cmd = await ctx.plugin.commands[0].load()
    await cmd.run([])
    expect(ctx.stdout).to.equal('it works!\n')
  })
  .it('loads a TS plugin')

  fancy
  .do(loadPlugin(path.join(__dirname, 'fixtures/typescript2')))
  .stdout()
  .do(async ctx => {
    const cmd = await ctx.plugin.commands[0].load()
    await cmd.run([])
    expect(ctx.stdout).to.equal('it works 2!\n')
  })
  .it('loads 2 TS plugins')
})
