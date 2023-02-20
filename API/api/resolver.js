const validator = require('validator');
const bcrypt = require('bcryptjs');
const { GraphQLError, GraphQLScalarType, Kind } = require('graphql');
const path = require('path');
const fs = require('fs');
const ImageSize = require('image-size');
const fileTypeFromFile = async buf => {
    fileTypeFromFile._cached = fileTypeFromFile._cached || (await import("file-type")).fileTypeFromFile
    return fileTypeFromFile._cached(buf)
}

const User = require('../app/models/users');
const Multimedia = require('../app/models/multimedia');
const Category = require('../app/models/category');


const dateScalar = new GraphQLScalarType({
    name: 'Date',
    description: 'Date custom scalar type',
    serialize(value) {
        if (value instanceof Date) {
            return value.getTime(); // Convert outgoing Date to integer for JSON
        }
        throw Error('GraphQL Date Scalar serializer expected a `Date` object');
    },
    parseValue(value) {
        if (typeof value === 'number') {
            return new Date(value); // Convert incoming integer to Date
        }
        throw new Error('GraphQL Date Scalar parser expected a `number`');
    },
    parseLiteral(ast) {
        if (ast.kind === Kind.INT) {
            // Convert hard-coded AST string to integer and then to Date
            return new Date(parseInt(ast.value, 10));
        }
        // Invalid hard-coded value (not an integer)
        return null;
    },
});

const resolvers = {

    Upload: require("graphql-upload-minimal").GraphQLUpload,
    Date: dateScalar,

    Query: {
        user: (param, args, { check }) => {
            if (check) {
                return "Negin Olfat"
            } else {
                const error = new Error('Input Error');
                error.data = 'دسترسی شما به اطلاعات  مسدود شده است';
                error.code = 401;
                throw new GraphQLError(error.data, {
                    extensions: { code: error.code },
                });
            }
        },

        login: async (param, args, { secretId }) => {
            let errorMessage;
            try {
                const user = await User.findOne({ phone: args.phone });
                if (!user) {
                    errorMessage = 'این کاربر در سیستم ثبت نشده است';
                    throw error;
                }

                const isValid = bcrypt.compareSync(args.password, user.password);
                if (!isValid) {
                    errorMessage = 'کلمه عبور وارد شده اشتباه است';
                    throw error;
                }

                return {
                    token: await User.CreateToken(user.id, secretId, '8h')
                }

            } catch {
                const error = new Error('Input Error');
                error.data = errorMessage;
                error.code = 401;
                throw new GraphQLError(errorMessage, {
                    extensions: { code: error.code },
                });
            }
        },

        getAllMultimedia: async (param, args, { check, isAdmin }) => {
            if (check && isAdmin) {
                let errorMessage;
                try {
                    const page = args.page || 1;
                    const limit = args.limit || 10;
                    const media = await Multimedia.paginate({}, { page, limit });

                    for (let index = 0; index < media.docs.length; index++) {
                        const element = media.docs[index];
                        ImageSize(path.join(__dirname, `/public/${element.dir}`), async (err, dim) => {
                            element.dimWidth = await dim.width,
                                element.dimHeight = await dim.height
                        })
                        const type = await fileTypeFromFile(path.join(__dirname, `/public/${element.dir}`))
                        element.format = type.ext
                    }

                    return media.docs

                } catch {
                    const error = new Error('Input Error');
                    error.data = errorMessage;
                    error.code = 401;
                    throw new GraphQLError(errorMessage, {
                        extensions: { code: error.code },
                    });
                }
            } else {
                const error = new Error('Input Error');
                error.data = 'دسترسی شما به اطلاعات مسدود شده است';
                error.code = 401;
                throw new GraphQLError(error.data, {
                    extensions: { code: error.code },
                });
            }
        },

        getAllCategory: async (param, args) => {

            if (args.input.mainCategory == true) {

                const page = args.input.page || 1;
                const limit = args.input.limit || 10;
                const category = await Category.paginate({ parent: null }, { page, limit });

                return category.docs

            } else if (args.input.mainCategory == false, args.input.parentCategory == true) {

                const page = args.input.page || 1;
                const limit = args.input.limit || 10;
                const category = await Category.paginate({ parent: args.input.catId }, { page, limit });

                return category.docs

            } else if (args.input.mainCategory == false, args.input.parentCategory == false) {
                const page = args.input.page || 1;
                const limit = args.input.limit || 10;
                const category = await Category.paginate({}, { page, limit });

                return category.docs
            }
        }

    },

    Mutation: {
        register: async (param, args) => {
            let errorMessage;
            try {
                if (validator.isEmpty(args.phone)) {
                    errorMessage = 'شماره تلفن نباید خالی ارسال شود.'
                    throw error;
                }
                if (!validator.isLength(args.phone, { min: 11, max: 11 })) {
                    errorMessage = 'شماره تلفن باید 11 کاراتر باشد';
                    throw error;
                }
                if (validator.isEmpty(args.password)) {
                    errorMessage = 'کلمه عبور نمی تواند خالی باشد'
                    throw error;
                }
                if (!validator.isLength(args.password, { min: 8 })) {
                    errorMessage = 'کلمه عبور حداقل باید 8 کاراکتر باشد';
                    throw error;
                }

                const user = await User.findOne({ phone: args.phone })
                if (user) {
                    errorMessage = 'این کاربر قبلا در سیستم ثبت شده است';
                    throw error;
                }

                const salt = bcrypt.genSaltSync(15);
                const hash = bcrypt.hashSync(args.password, salt);


                await User.create({
                    phone: args.phone,
                    password: hash
                })

                return {
                    status: 200,
                    message: 'اطلاعات شما در سیستم ثبت شد'
                }
            } catch {
                const error = new Error('Input Error');
                error.data = errorMessage;
                error.code = 401;
                throw new GraphQLError(errorMessage, {
                    extensions: { code: error.code },
                });
            }

        },

        multimedia: async (param, args, { check, isAdmin }) => {
            console.log("args.image")
            if (check && isAdmin) {
                let errorMessage;
                try {

                    console.log(args)
                    // const { createReadStream, filename } = await args.image;
                    // const stream = createReadStream();
                    // const { filePath } = await saveImage({ stream, filename });

                    // await Multimedia.create({
                    //     name: filename,
                    //     dir: filePath
                    // })

                    // return {
                    //     status: 200,
                    //     message: 'تصاویر در رسانه ذخیره شد'
                    // }

                } catch {
                    const error = new Error('Input Error');
                    error.data = errorMessage;
                    error.code = 401;
                    throw new GraphQLError(errorMessage, {
                        extensions: { code: error.code },
                    });
                }
            } else {
                const error = new Error('Input Error');
                error.data = 'دسترسی شما به اطلاعات مسدود شده است';
                error.code = 401;
                throw new GraphQLError(error.data, {
                    extensions: { code: error.code },
                });
            }
        },

        category: async (param, args, { check, isAdmin }) => {
            if (check && isAdmin) {
                let errorMessage;
                try {

                    if (validator.isEmpty(args.name)) {
                        errorMessage = 'فیلد نام نباید خالی باشد'
                        throw error;
                    }
                    if (validator.isEmpty(args.image)) {
                        errorMessage = 'لطفا تصویر را انتخاب نمایید'
                        throw error;
                    }
                    if (await Category.findOne({ name: args.name })) {
                        errorMessage = ' دسته بندی با این نام قبلا ایجاد شده است'
                        throw error;
                    }

                    await Category.create({
                        name: args.name,
                        parent: args.parent,
                        image: args.image
                    });

                    return {
                        status: 200,
                        message: 'دسته بندی مورد نظر ایجاد شد'
                    }

                } catch {
                    const error = new Error('Input Error');
                    error.data = (errorMessage !== "") ? errorMessage : 'ذخیره دسته یندی امکان پذیر نیست';
                    error.code = 401;
                    throw new GraphQLError(errorMessage, {
                        extensions: { code: error.code },
                    });
                }
            } else {
                const error = new Error('Input Error');
                error.data = 'دسترسی شما به اطلاعات مسدود شده است';
                error.code = 401;
                throw new GraphQLError(error.data, {
                    extensions: { code: error.code },
                });
            }
        }
    },
}

let saveImage = ({ stream, filename }) => {
    const date = new Date();
    let dir = `/uploads/${date.getFullYear()}/${date.getMonth() + 1}`;
    mkdirp.sync(path.join(__dirname, `/public/${dir}`))

    let filePath = `${dir}/${filename}`;

    if (fs.existsSync(path.join(__dirname, `/public/${filePath}`))) {
        filePath = `${dir}/${Date.now()}-${filename}`
    }

    return new Promise((resolve, reject) => {
        stream
            .pipe(fs.createWriteStream(path.join(__dirname, `/public/${filePath}`)))
            .on('error', error => reject(error))
            .on('finish', () => resolve({ filePath }))
    })
}


module.exports = resolvers;