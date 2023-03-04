const validator = require('validator');
const bcrypt = require('bcryptjs');
const { GraphQLError, GraphQLScalarType, Kind } = require('graphql');
const path = require('path');
const fs = require('fs');
const ImageSize = require('image-size');

const User = require('../app/models/users');
const Multimedia = require('../app/models/multimedia');
const Category = require('../app/models/category');
const Brand = require('../app/models/brand');
const Survey = require('../app/models/survey');



const fileTypeFromFile = async buf => {
    fileTypeFromFile._cached = fileTypeFromFile._cached || (await import("file-type")).fileTypeFromFile
    return fileTypeFromFile._cached(buf)
}

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
                    error.data = 'امکان نمایش تصاویر  وجود ندارد';
                    error.code = 401;
                    throw new GraphQLError(error.data, {
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
            try {
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
            } catch {
                const error = new Error('Input Error');
                error.data = 'امکان نمایش دسته بندی ها وجود ندارد';
                error.code = 401;
                throw new GraphQLError(error.data, {
                    extensions: { code: error.code },
                });
            }
        },

        getAllBrand: async (param, args, { check, isAdmin }) => {
            if (check && isAdmin) {
                try {
                    const page = args.input.page || 1;
                    const limit = args.input.limit || 10;

                    if (args.input.getAll) {
                        const brands = await Brand.paginate({}, { page, limit });
                        return brands.docs;

                    } else if (!args.input.getAll && args.input.category) {
                        const brands = await Brand.paginate({ category: args.input.category }, { page, limit });
                        return brands.docs;
                    } else {
                        throw error
                    }

                } catch {
                    const error = new Error('Input Error');
                    error.data = 'امکان نمایش برند ها وجود ندارد';
                    error.code = 401;
                    throw new GraphQLError(error.data, {
                        extensions: { code: error.code },
                    });
                }
            } else {
                console.log(args.input)
                const error = new Error('Input Error');
                error.data = 'دسترسی شما به اطلاعات مسدود شده است';
                error.code = 401;
                throw new GraphQLError(error.data, {
                    extensions: { code: error.code },
                });
            }
        },

        getAllSurvey: async (param, args) => {
            let errorMessage = 'امکان نمایش معیار امتیاز دهی وجود ندارد'
            try {
                const category = await Category.findById(args.categoryId).populate('parent').exec();
                if (category.parent == null) {
                    errorMessage = 'برای این دسته بندی هیج معیار امتیاز دهی ثبت نشده است'
                    throw error;
                } else if (category.parent.parent == null) {
                    const list = await Survey.find({ category: args.categoryId })
                    if (list.length == 0) {
                        errorMessage = 'برای این دسته بندی هیج معیار امتیاز دهی ثبت نشده است'
                        throw error;
                    }
                    return list
                } else {
                    const parentCategory = await Category.findById(category.parent)
                    const list = await Survey.find({ category: parentCategory._id })
                    if (list.length == 0) {
                        errorMessage = 'برای این دسته بندی هیج معیار امتیاز دهی ثبت نشده است'
                        throw error;
                    }
                    return list
                }

            } catch {
                const error = new Error('Input Error');
                error.data = errorMessage;
                error.code = 401;
                throw new GraphQLError(error.data, {
                    extensions: { code: error.code },
                });
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
                let errorMessage = 'ذخیره دسته یندی امکان پذیر نیست';
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
                    error.data = errorMessage;
                    error.code = 401;
                    throw new GraphQLError(error.data, {
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

        brand: async (param, args, { check, isAdmin }) => {
            if (check && isAdmin) {
                let errorMessage = 'ذخیره برند امکان پذیر نیست'
                try {

                    // const { createReadStream, filename } = await args.image;
                    // const stream = createReadStream();
                    // // const { filePath } = await saveImage({ stream, filename });
                    // if (validator.isEmpty(filePath)) {
                    //      errorMessage = 'تصویر را نمی توانید خالی بگذارید' 
                    // }

                    if (validator.isEmpty(args.input.name)) {
                        errorMessage = 'نام برند را نمی توانید خالی بگذارید';
                        throw error;
                    }

                    if (args.input.category.length == 0) {
                        errorMessage = 'دسته بندی برند را نمی توانید خالی بگذارید';
                        throw error;
                    }

                    await Brand.create({
                        name: args.input.name,
                        category: args.input.category,
                        image: args.input.image
                    });

                    return {
                        status: 200,
                        message: 'برند برای دسته بندی مورد نظر ایجاد شد'
                    }

                } catch {
                    const error = new Error('Input Error');
                    error.data = errorMessage;
                    error.code = 401;
                    throw new GraphQLError(error.data, {
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

        survey: async (param, args, { check, isAdmin }) => {
            if (check && isAdmin) {
                let errorMessage = 'ذخیره معیار های امتیاز دهی امکان پذیر نیست'
                try {

                    for (let index = 0; index < args.input.list.length; index++) {
                        const element = args.input.list[index];

                        if (!await Category.findOne({ _id: element.category })) {
                            errorMessage = 'دسته بندی قبلا ثبت نشده است';
                            throw error
                        }

                        if (!await Survey.findOne({ name: element.name, category: element.category })) {
                            await Survey.create({
                                category: element.category,
                                name: element.name,
                            })
                        }
                    }

                    return {
                        status: 200,
                        message: 'معیاری های امتیاز دهی برای این دسته بندی ذخیره شد.'
                    }

                } catch {
                    const error = new Error('Input Error');
                    error.data = errorMessage;
                    error.code = 401;
                    throw new GraphQLError(error.data, {
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
    },

    // relationship

    Category: {
        parent: async (param, args) => await Category.findOne({ _id: param.parent }),
        image: async (param, args) => await Multimedia.findOne({ _id: param.image })
    },
    Brand: {
        category: async (param, args) => await Category.find({ _id: param.category })
    },
    Survey: {
        category: async (param, arges) => await Category.findOne({ _id: param.category })
    }
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