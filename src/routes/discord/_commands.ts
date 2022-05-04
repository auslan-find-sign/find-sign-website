export default [
  {
    name: 'auslan',
    description: 'Lookup an Auslan sign using find.auslan.fyi search',
    type: 1,
    options: [
      {
        name: 'query',
        required: true,
        type: 3
      }
    ]
  },
  {
    name: 'random-auslan',
    description: 'Post a random Auslan vocab video, from find.auslan.fyi',
    type: 1
  }
]