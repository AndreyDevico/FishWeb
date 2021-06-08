const { Router } = require('express')
const router = Router()
const nodemailer = require('nodemailer')
const message = require('../email/message')
const contact = require('../email/contact')
const Order = require('../models/Order')
const pdfTemplate = require('../documents');
const pdf = require('html-pdf')

require('dotenv').config()


let transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 587,
  secure: false,
  auth: {
    user: process.env.EMAIL,
    pass: process.env.PASSWORD
  },
})

router.post('/order', async (req, res) => {
  const { userInfo , cart , totalPrice } = req.body

  const order = new Order({
    ...userInfo,
    products: [...cart]
  })
  await order.save()

  await transporter.sendMail(message(process.env.EMAIL, userInfo.phone , cart , totalPrice), function (err, data) {
    if (err) {
      console.log(err)
    } else {
      console.log(data, 'email sent')
      res.json({ message: 'sent' })
    }
  })

  res.send({orderID: order._id})
})

router.post('/contact-us', async(req, res) => {
  const {body: {email, text}} = req

  await transporter.sendMail(contact(email, text), function (err, data) {
    if (err) {
      console.log(err)
    } else {
      console.log(data, 'email sent')
      res.json({ message: 'sent' })
    }
  })
})

router.post('/create-pdf', async(req, res) => {
  const {body: { orderId }} = req
  console.log("🚀 ~ file: order.route.js ~ line 78 ~ router.post ~ req.body", req.body)
  console.log("🚀 ~ file: order.route.js ~ line 59 ~ router.post ~ orderId", orderId)

  const order = await Order.findById(orderId)
  console.log("🚀 ~ file: order.route.js ~ line 61 ~ router.post ~ order", order)

  const totalPrice = order.products.reduce((acc, item) => {
    return acc = Number(acc) + Number(item.price * item.selectedSize.length)
  }, 0)
  console.log("🚀 ~ file: order.route.js ~ line 66 ~ totalPrice ~ totalPrice", totalPrice)

  pdf.create(pdfTemplate({order, totalPrice}), {}).toFile(`${__dirname}/result.pdf`, (err) => {
    if(err) {
        res.send(Promise.reject());
    }

    res.send(Promise.resolve());
  });
})

router.get('/fetch-pdf', (req, res) => {
  res.sendFile(`${__dirname}/result.pdf`)
})

module.exports = router