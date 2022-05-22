import { expect, describe, it } from 'vitest'
import { tokenize, parseQuery, compileQuery, QueryAuthor, getQueryRequirements } from '../src/lib/search/text'
import type { QueryTag, QueryWord, QueryOrNode, QueryAndNode } from '../src/lib/search/text'
import type { LibraryEntry } from '../src/lib/search/search-index'

describe('/src/lib/search/text tokenize()', () => {
  it('handles simple space seperated phrases', () => {
    expect(tokenize('hello world')).to.deep.equal(['hello', 'world'])
    expect(tokenize('how are you today')).to.deep.equal(['how', 'are', 'you', 'today'])
    expect(tokenize('#hashtag -#negative @author -@negative')).to.deep.equal(['#hashtag', '-#negative', '@author', '-@negative'])
  })

  it('doesn\'t include weird whitespace', () => {
    expect(tokenize('  yo     ')).to.deep.equal(['yo'])
    expect(tokenize('  yo   dawg  ')).to.deep.equal(['yo', 'dawg'])
    expect(tokenize('  yo  \r\n dawg  \t')).to.deep.equal(['yo', 'dawg'])
  })

  it('handles parens and quotes', () => {
    expect(tokenize('“hello world”')).to.deep.equal(['“', 'hello', 'world', '”'])
    expect(tokenize('((a b) c) d')).to.deep.equal(['(', '(', 'a', 'b', ')', 'c', ')', 'd'])
  })

  it('copes with messy situations', () => {
    expect(tokenize('("(foo")')).to.deep.equal(['(', '"', '(', 'foo', '"', ')'])
  })
})

// builders to conveniently mock syntax trees
function and (left, right): QueryAndNode {
  return { type: 'and', left, right }
}
function or (left, right): QueryOrNode {
  return { type: 'or', left, right }
}
function word (string): QueryWord {
  return { type: 'word', string }
}
function tag (string, positive = true): QueryTag {
  return { type: 'tag', string, positive }
}
function author (id, positive = true): QueryAuthor {
  return { type: 'author', id, positive }
}

function entry (obj): LibraryEntry {
  return {
    words: [],
    tags: [],
    diversity: 0,
    path: [0, 0],
    ...obj
  }
}

describe('/src/lib/search/text parseQuery()', () => {
  it('returns undefined for an empty or whitespace string', () => {
    expect(parseQuery('')).to.be.undefined
    expect(parseQuery('     ')).to.be.undefined
    expect(parseQuery('    \t ')).to.be.undefined
    expect(parseQuery('\t')).to.be.undefined
    expect(parseQuery('\r\n')).to.be.undefined
  })

  it('parses a simple AND', () => {
    expect(parseQuery('foo AND bar')).to.deep.equal(and(word('foo'), word('bar')))
  })

  it('parses a simple OR', () => {
    expect(parseQuery('foo OR bar')).to.deep.equal(or(word('foo'), word('bar')))
  })

  it('parses positive hashtags', () => {
    expect(parseQuery('#some.hash-tag')).to.deep.equal(tag('some.hash-tag'))
  })

  it('parses negative hashtags', () => {
    expect(parseQuery('-#some.hash-tag')).to.deep.equal(tag('some.hash-tag', false))
  })

  it('parses two hashtags', () => {
    expect(parseQuery('#left -#right')).to.deep.equal(and(tag('left'), tag('right', false)))
  })

  it('parses positive authors', () => {
    expect(parseQuery('@phoenix')).to.deep.equal(author('phoenix'))
  })

  it('parses negative authors', () => {
    expect(parseQuery('-@phoenix')).to.deep.equal(author('phoenix', false))
  })

  it('parses words in to ands', () => {
    expect(parseQuery('one two three')).to.deep.equal(
      and(
        word('one'),
        and(
          word('two'),
          word('three')
        )
      )
    )
  })

  it('parses hashtag OR correctly', () => {
    expect(parseQuery('#one OR #two')).to.deep.equal(
      or(tag('one'), tag('two'))
    )
  })

  it('parses an OR chain correctly', () => {
    expect(parseQuery('one OR two OR three')).to.deep.equal(
      or(or(word('one'), word('two')), word('three'))
    )
  })

  it('parses an OR chain surrounded by default-ands', () => {
    expect(parseQuery('left one OR two OR three right')).to.deep.equal(
      and(
        word('left'),
        and(
          or(
            or(
              word('one'),
              word('two')
            ),
            word('three')
          ),
          word('right')
        )
      )
    )
  })

  it('parses a complex query well', () => {
    expect(parseQuery('looking for something OR someone #apricot -#color')).to.deep.equal(
      and(
        word('looking'),
        and(
          word('for'),
          and(
            or(
              word('something'),
              word('someone')
            ),
            and(
              tag('apricot'),
              tag('color', false)
            )
          )
        )
      )
    )
  })

  it('pointless paren still resolves to AND', () => {
    const [a, b] = [...'ab'].map(word)
    expect(parseQuery('(a b)')).to.deep.equal(and(a, b))
  })

  it('parens make tree structure explicit', () => {
    const [a, b, c] = [...'abc'].map(word)
    expect(parseQuery('(a b) c')).to.deep.equal(and(and(a, b), c))
    expect(parseQuery('a (b c)')).to.deep.equal(and(a, and(b, c)))
    expect(parseQuery('(a b) OR c')).to.deep.equal(or(and(a, b), c))
    expect(parseQuery('(a OR b) OR c')).to.deep.equal(or(or(a, b), c))
    expect(parseQuery('a OR (b OR c)')).to.deep.equal(or(a, or(b, c)))
  })

  it('parens inside parens work', () => {
    const [a, b, c, d] = [...'abcd'].map(word)
    expect(parseQuery('((a b) c) d')).to.deep.equal(and(and(and(a, b), c), d))
    expect(parseQuery('a (b (c d))')).to.deep.equal(and(a, and(b, and(c, d))))
  })
})

describe('/src/lib/search/text compileQuery()', () => {
  it('tag inclusion', async () => {
    const rankFn = await compileQuery('#abc')
    expect(rankFn).to.be.a('function')
    expect(rankFn(entry({ tags: [] }))).to.equal(Infinity)
    expect(rankFn(entry({ tags: ['abc', 'def'] }))).to.equal(0)
    expect(rankFn(entry({ tags: ['def'] }))).to.equal(Infinity)
  })

  it('tag exclusion', async () => {
    const rankFn = await compileQuery('-#abc')
    expect(rankFn).to.be.a('function')
    expect(rankFn(entry({ tags: [] }))).to.equal(0)
    expect(rankFn(entry({ tags: ['abc', 'def'] }))).to.equal(Infinity)
    expect(rankFn(entry({ tags: ['def'] }))).to.equal(0)
  })

  it('tag inclusion and exclusion', async () => {
    const rankFn = await compileQuery('#abc -#def')
    expect(rankFn).to.be.a('function')
    expect(rankFn(entry({ tags: [] }))).to.equal(Infinity)
    expect(rankFn(entry({ tags: ['abc', 'def'] }))).to.equal(Infinity)
    expect(rankFn(entry({ tags: ['def'] }))).to.equal(Infinity)
    expect(rankFn(entry({ tags: ['abc'] }))).to.equal(0)
    expect(rankFn(entry({ tags: ['abc', 'xyz'] }))).to.equal(0)
  })

  it('tag OR pair', async () => {
    const rankFn = await compileQuery('#abc OR #def')
    expect(rankFn).to.be.a('function')
    expect(rankFn(entry({ tags: [] }))).to.equal(Infinity)
    expect(rankFn(entry({ tags: ['abc', 'def'] }))).to.equal(0)
    expect(rankFn(entry({ tags: ['def'] }))).to.equal(0)
    expect(rankFn(entry({ tags: ['abc'] }))).to.equal(0)
    expect(rankFn(entry({ tags: ['abc', 'xyz'] }))).to.equal(0)
    expect(rankFn(entry({ tags: ['jjj', 'xyz'] }))).to.equal(Infinity)
  })

  it('authors', async () => {
    const onlyPhoenix = await compileQuery('@phoenix')
    const noPhoenix = await compileQuery('-@phoenix')
    expect(onlyPhoenix(entry({ author: { id: 'phoenix' }}))).to.equal(0)
    expect(noPhoenix(entry({ author: { id: 'phoenix' }}))).to.equal(Infinity)
  })

  it('known irritants', async () => {
    expect(parseQuery('if a tree falls in the woods?')).to.deep.equal(
      and(
        word('if'),
        and(
          word('a'),
          and(
            word('tree'),
            and(
              word('falls'),
              and(
                word('in'),
                and(
                  word('the'),
                  word('woods')
                )
              )
            )
          )
        )
      )
    )
  })
})

describe('/src/lib/search/text getQueryRequirements()', () => {
  it('notices words', () => {
    expect(getQueryRequirements(parseQuery('foo bar'))).to.deep.equal(['words'])
    expect(getQueryRequirements(parseQuery('(foo bar)'))).to.deep.equal(['words'])
    expect(getQueryRequirements(parseQuery('foo OR bar'))).to.deep.equal(['words'])
  })

  it('notices tags', () => {
    expect(getQueryRequirements(parseQuery('#tag'))).to.deep.equal(['tags'])
    expect(getQueryRequirements(parseQuery('-#tag'))).to.deep.equal(['tags'])
    expect(getQueryRequirements(parseQuery('#a OR #b'))).to.deep.equal(['tags'])
  })

  it('notices authors', () => {
    expect(getQueryRequirements(parseQuery('@someone'))).to.deep.equal(['author'])
    expect(getQueryRequirements(parseQuery('-@user'))).to.deep.equal(['author'])
    expect(getQueryRequirements(parseQuery('@a OR @b'))).to.deep.equal(['author'])
  })
})