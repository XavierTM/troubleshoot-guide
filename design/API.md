
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