import jwt from 'jsonwebtoken'

const getUserId = (request, requireAuth = true) => {
    const AuthHeader = request.request ? request.request.headers.authorization : request.connexion.context.Authorization

    if (AuthHeader) {
        const token = AuthHeader.replace('Bearer ', '')
        const decoded = jwt.verify(token, process.env.JWT_SECRET)

        return decoded.userId
    }

    if (requireAuth) {
        throw new Error('Authetication Required')
    }

    return null
}

export { getUserId as default }