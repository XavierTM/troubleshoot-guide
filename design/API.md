
# API design

## Add answer
**POST** `/api/answers`
**expects**: 
```js
{
   caption: String,
   question: Number,
}
```

## Retrieve answers
**GET** `/api/answers`
**expects**: 
```js
[
   {
      id: String,
      caption: String,
      sub_question: String,
      solution: String,
      question: Number,
   },
   ...
]
```

## Remove answer
**DELETE** `/api/answers/:id`

## Edit answer
**PATCH** `/api/answers/:id`
**expects**: 
```js
{
   caption: String,
   sub_question: String,
   solution: String,
}
```