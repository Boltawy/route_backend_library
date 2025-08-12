const successHandler = (res, data = null) => {
    if (data) return res.status(200).json({ "status": "success", data })
    return res.status(200).json({ "status": "success" })
}

export default successHandler