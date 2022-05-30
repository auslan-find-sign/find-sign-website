import fs from 'node:fs'
import { expect, describe, it } from 'vitest'
import { parse, build } from '../src/lib/search/precomputed-vectors.js'

const sampleLPSData = fs.readFileSync(new URL('search.precomputed-vectors.sample.lps', import.meta.url))

describe('/src/lib/search/precomputed-vectors parse()', () => {
  it('seems to parse words correctly', () => {
    const words = [...parse(sampleLPSData)].map(x => x.word)
    expect(words).to.deep.equal([
      'werewolf', 'grady', 'idly', 'verdes', 'wieder', '0.89', 'teared', 'goaltenders', 'shami',
      'evander', 'suo', 'mangalsutra', '1039', 'mountable', 'battery-operated', 'courteously',
      '24-year', 'lectins', 'kyrgios', 'insomuch', 'myntra', 'giller', 'six-member', 'screw-in',
      'bachus', '4.5-star', 'emailer', 'krisztina', '9.39', 'poissy', 'non-diy', 'glimmered',
      'ayon', 'dnce', 'phosphoenolpyruvate', 'foundsorry', 'utterson', 'wifi.', 'again--', 'honey.',
      'b-tree', '3633', 'nehlen', 'tagebuch', 'self-enrichment', 'apeejay', 'edcast', 'suavely',
      '10.8.2', 'unnati', 'park.rooms', 'dismore', 'goryachy', '20069', 'device.more', 'wrc-tv',
      'palmpilot', 'elcome', 'propertiapartemenmengakomodasi1kamar', 'getaway.', 'x-windows',
      'wearechangetv', '216-4444', 'maledom', 'miami.', 'birkholz', 'dimmi'
    ])
  })

  it('seems to parse vectors correctly', () => {
    const vectors = [...parse(sampleLPSData)].map(x => x.getVector())

    function fuzzy(...args) {
      return args.map(x => Math.round(x * 1000) / 1000)
    }
    expect(fuzzy(...vectors[0])).to.deep.equal(fuzzy(0.011400000254313149,0.019447059257357735,0.012741176754820574,0.05968235427258063,0.09723529628678863,-0.05565882477105832,0.011400000254313149,-0.07980000178019206,0.003352941251268562,-0.002011764750761137,-0.03956470676496916,-0.07980000178019206,-0.06236470727359548,-0.07443529577816234,-0.020788235757865158,0.04492941276699888,0.019447059257357735,-0.07845882527968463,-0.08248235478120691,0.036882353763954295,-0.015423529755835441,-0.020788235757865158,-0.031517647761924596,0.05029411876902862,0.014082353255327999,-0.036882353763954316,0.026152941759894858,0.07577647227866977,-0.06772941327562519,0.17100000381469727,0.019447059257357735,0.10662353179034065,0.026152941759894858,0.028835294760909746,-0.038223530264461736,0.03554117726344687,0.026152941759894858,-0.016764706256342868,0.003352941251268562,0.016764706256342885,0.036882353763954295,0.05834117777207317,-0.03420000076293945,0.04627058926750631,-0.07175294277714747,-0.020788235757865158,0.03822353026446176,0.010058823753805724,-0.03285882426243202,0.05565882477105832,-0.04224705976598403,0.028835294760909746,-0.024811765259387452,0.05431764827055089,-0.03285882426243202,-0.016764706256342868,0.07309411927765491,-0.015423529755835441,-0.024811765259387452,0.09321176678526637,-0.03420000076293945,0.023470588758880008,-0.012741176754820574,0.015423529755835422,0.006035294252283449,0.07577647227866977,0.07309411927765491,-0.036882353763954316,-0.03554117726344689,0.03285882426243202,-0.03420000076293945,-0.04761176576801375,-0.04895294226852118,0.03285882426243202,-0.07175294277714747,-0.00603529425228343,0.04492941276699888,-0.05431764827055089,-0.016764706256342868,0.03285882426243202,-0.03956470676496916,0.026152941759894858,0.10260000228881837,-0.0905294137842515,-0.011400000254313149,0.022129412258372585,0.011400000254313149,0.019447059257357735,0.003352941251268562,-0.004694117751776005,-0.050294118769028597,0.0637058837741029,-0.03956470676496916,0.04090588326547661,-0.0087176472532983,0.011400000254313149,0.007376470752790874,0.09857647278729606,0.0087176472532983,0.003352941251268562,-0.04895294226852118,0.051635295269536044,0.06236470727359548,-0.022129412258372585,0.04090588326547661,0.04627058926750631,0.015423529755835422,0.09187059028475894,0.020788235757865158,-0.00603529425228343,0.0087176472532983,0.04895294226852119,0.07845882527968462,0.014082353255327999,0.002011764750761137,-0.05297647177004347,-0.0945529432857738,0.04895294226852119,-0.0006705882502537123,0.004694117751775986,-0.022129412258372585,-0.03956470676496916,-0.00603529425228343,-0.05565882477105832,0.04492941276699888,0.1549058858086081,0.07175294277714749,0.06638823677511775,-0.00603529425228343,-0.05297647177004347,0.014082353255327999,-0.04492941276699888,-0.002011764750761137,-0.0087176472532983,0.007376470752790874,-0.0006705882502537123,0.07980000178019205,0.08382353128171435,0.031517647761924596,0.0087176472532983,-0.01810588275685029,0.004694117751775986,-0.046270589267506324,-0.03420000076293945,-0.019447059257357735,-0.011400000254313149,-0.0637058837741029,0.010058823753805724,-0.036882353763954316,0.004694117751775986,-0.022129412258372585,0.03420000076293945,-0.002011764750761137,-0.019447059257357735,0.007376470752790874,-0.02883529476090973,0.022129412258372585,-0.014082353255328016,0.036882353763954295,0.05565882477105832,0.07845882527968462,0.010058823753805724,0.05029411876902862,0.04492941276699888,0.05029411876902862,-0.015423529755835441,0.07443529577816234,0.043588236266491456,-0.051635295269536044,-0.0087176472532983,-0.0637058837741029,-0.002011764750761137,-0.023470588758880008,0.0945529432857738,-0.07577647227866977,0.007376470752790874,0.003352941251268562,0.06236470727359548,-0.036882353763954316,0.05565882477105832,0.003352941251268562,-0.012741176754820574,0.003352941251268562,-0.06907058977613262,0.06504706027461032,0.020788235757865158,0.06772941327562518,0.012741176754820574,-0.027494118260402302,0.023470588758880008,-0.027494118260402302,0.04761176576801373,-0.04224705976598403,-0.0006705882502537123,0.11601176729389266,0.04761176576801373,-0.06772941327562519,0.011400000254313149,0.031517647761924596,0.023470588758880008,0.018105882756850312,0.007376470752790874,0.016764706256342885,0.0945529432857738,0.03554117726344687,0.03956470676496918,0.043588236266491456,0.0006705882502537123,-0.03285882426243202,0.0006705882502537123,-0.016764706256342868,-0.046270589267506324,-0.012741176754820574,0.023470588758880008,0.03420000076293945,0.0087176472532983,-0.04895294226852118,-0.003352941251268581,0.0087176472532983,0.022129412258372585,0.03420000076293945,0.002011764750761137,-0.06907058977613262,0.003352941251268562,0.002011764750761137,-0.04895294226852118,-0.010058823753805724,-0.0087176472532983,-0.003352941251268581,-0.012741176754820574,-0.10528235528983322,0.031517647761924596,0.031517647761924596,0.026152941759894858,-0.043588236266491456,0.012741176754820574,-0.16429412131216012,-0.01810588275685029,-0.03956470676496916,0.07711764877917719,0.0945529432857738,-0.023470588758880008,-0.02883529476090973,-0.04895294226852118,0.03956470676496918,-0.023470588758880008,0.011400000254313149,-0.019447059257357735,-0.003352941251268581,0.006035294252283449,-0.014082353255328016,0.0087176472532983,-0.01810588275685029,0.014082353255327999,-0.031517647761924596,0.06102353077308806,-0.17100000381469727,-0.06102353077308804,0.022129412258372585,-0.02883529476090973,-0.08248235478120691,-0.016764706256342868,-0.0006705882502537123,-0.012741176754820574,-0.043588236266491456,0.016764706256342885,0.018105882756850312,0.006035294252283449,0.03285882426243202,-0.015423529755835441,-0.05565882477105832,0.04090588326547661,-0.027494118260402302,0.007376470752790874,-0.022129412258372585,0.026152941759894858,-0.027494118260402302,0.03554117726344687,-0.04492941276699888,-0.04895294226852118,0.04224705976598403,0.05297647177004347,-0.015423529755835441,-0.08114117828069949,0.03285882426243202,0.04627058926750631,0.007376470752790874,0.06504706027461032,-0.06236470727359548,-0.02883529476090973,-0.043588236266491456,-0.007376470752790855,-0.06772941327562519,0.0945529432857738,0.04627058926750631,0.012741176754820574,0.05968235427258063,0.08918823728374405,0.04224705976598403,-0.07041176627664004))
  })
})

describe('/src/lib/search/precomputed-vectors build()', () => {
  it('roundtrips a single item well', () => {
    const output = [...parse(build({
      'test': [-1, +1],
      'test2': [-5, +5],
    }))].map(({ word, getVector }) => ({ word, vector: getVector() }))

    expect(output).to.deep.equal([
      { word: 'test', vector: Float32Array.from([-1, +1]) },
      { word: 'test2', vector: Float32Array.from([-5, +5]) }
    ])
  })

  it('roundtrips a two items well', () => {
    const output = [...parse(build({
      'test': [-2, +2]
    }))].map(({ word, getVector }) => ({ word, vector: getVector() }))

    expect(output).to.deep.equal([
      { word: 'test', vector: Float32Array.from([-2, +2])}
    ])
  })

  it('roundtrips each item in the sample', () => {
    const entries = [...parse(sampleLPSData)].map(x => [x.word, x.getVector()])
    for (const [word, vec] of entries) {
      const [out] = [...parse(build({ [word]: vec }))]
      expect(out.word).to.equal(word)
      expect(out.getVector()).to.deep.equal(vec)
    }
  })

  it('can create an equivilent sample file which parses to the same data', () => {
    const sample = Object.fromEntries([...parse(sampleLPSData)].map(x => [x.word, x.getVector()]))
    const repro = Object.fromEntries([...parse(build(sample))].map(x => [x.word, x.getVector()]))
    expect(repro).to.deep.equal(sample)
  })
})
