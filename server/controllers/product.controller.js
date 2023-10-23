import Product from '../models/product.model.js'
import extend from 'lodash/extend.js'
import errorHandler from './error.controller.js'

const create = async (req, res) => {
    const product = new Product(req.body)
    try {
        await product.save()
        return res.status(200).json({ message: "Successfully created a product!" })
    } catch (err) {
        return res.status(400).json({ error: errorHandler.getErrorMessage(err)})
    }
}

const list = async (req, res) => {
    if (req.query.name) {
        return findByName(req, res)
    }
    try {
        let product = await Product.find()
        res.json(product)
    } catch (err) {
        return res.status(400).json({ error: errorHandler.getErrorMessage(err)})
    }
}

const productById = async (req, res, next, id) => {
    try {
        let product = await Product.findById(id)
        if (!product)
        return res.status('400').json({ error: "Product not found." })
        req.profile = product
        next()
    } catch (err) {
        return res.status('400').json({ error: "Could not retrieve product." })
    }
}

const read = (req, res) => {
    return res.json(req.profile)
}

const update = async (req, res) => { 
    try {
        let product = req.profile
        product = extend(product, req.body)
        product.updated = Date.now()
        await product.save()
        res.json(product)
    } catch (err) {
        return res.status(400).json({ error: errorHandler.getErrorMessage(err)})
    }
}

const remove = async (req, res) => {
    try {
        let product = req.profile
        let deletedProduct = await product.deleteOne()
        res.json(deletedProduct)
    } catch (err) {
        return res.status(400).json({ error: errorHandler.getErrorMessage(err)})
    }
}

const removeAll = async (req, res) => {
    try {
        await Product.deleteMany()
        res.json({ message: "All products removed." })
    } catch (err) {
        return res.status(400).json({ error: errorHandler.getErrorMessage(err)})
    }
}

const findByName = async (req, res) => {
    const searchString = req.query.name
    try {
        const product = await Product.find({
            name: { $regex: new RegExp(searchString, "i") },
        })
        res.json(product)
    } catch (err) {
        return res.status(400).json({ error:
        errorHandler.getErrorMessage(err)})
    }
}

export default { create, productById, read, list, remove, update, removeAll, findByName }