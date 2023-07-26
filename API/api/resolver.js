const validator = require('validator');
const bcrypt = require('bcryptjs');
const { GraphQLError, GraphQLScalarType, Kind } = require('graphql');
const path = require('path');
const fs = require('fs');
const ImageS = require('image-size');

const User = require('../app/models/users');
const Multimedia = require('../app/models/multimedia');
const Category = require('../app/models/category');
const Brand = require('../app/models/brand');
const Survey = require('../app/models/survey');
const ProductSpecs = require('../app/models/productSpecs');
const ProductSpecsDetails = require('../app/models/productSpecsDetails');
const Seller = require('../app/models/seller');
const Slider = require('../app/models/slider');
const Product = require('../app/models/product');
const ProductAttribute = require('../app/models/productAttribute');
const ProductDetails = require('../app/models/productDetails');
const OrderStatus = require('../app/models/orderStatus');
const Comment = require('../app/models/comment');
const SurveyValues = require('../app/models/surveyValues');
const Favorite = require('../app/models/favorite');
const Payment = require('../app/models/payment');

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

const uploadScalar = new GraphQLScalarType({
    name: 'Upload',
    description: 'The `Upload` scalar type represents an image..',
    serialize(value) {
        console.log(value)
        if (value instanceof Promise) return value;
        throw new GraphQLError('Upload value invalid.');
    },
    parseValue(value) {
        console.log(value)
        if (value instanceof Promise) return value;
        const { createReadStream, filename, mimetype, encoding } = value;
        if (!createReadStream) {
            throw new GraphQLError('Upload value invalid.');
        }
        const stream = createReadStream();
        stream.filename = filename;
        stream.mimetype = mimetype;
        stream.encoding = encoding;
        return stream;
    },
    parseLiteral(ast) {
        console.log(ast)
        throw new GraphQLError(`Upload literal unsupported.${ast}`);
    },
});

const resolvers = {

    Upload: uploadScalar,
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
                console.log(secretId)
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
                        ImageS.imageSize(path.join(__dirname, `/public${element.dir}/${element.name}`), async (err, dim) => {
                            element.dimWidth = await dim.width
                            element.dimHeight = await dim.height
                        })
                        const type = await fileTypeFromFile(path.join(__dirname, `/public/${element.dir}/${element.name}`))
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
        },

        getAllProductSpecs: async (param, args, { check, isAdmin }) => {
            if (check && isAdmin) {
                let errorMessage = 'امکان نمایش مشخصات وجود ندارد'
                try {
                    const category = await Category.findById(args.categoryId).populate('parent').exec();
                    if (category.parent == null) {
                        errorMessage = 'برای این دسته بندی هیج مشخصاتی ثبت نشده است'
                        throw error;
                    } else if (category.parent.parent == null) {
                        const list = await ProductSpecs.find({ category: args.categoryId })
                        if (list.length == 0) {
                            errorMessage = 'برای این دسته بندی هیج مشخصاتی ثبت نشده است'
                            throw error;
                        }
                        return list
                    } else {
                        const parentCategory = await Category.findById(category.parent)
                        const list = await ProductSpecs.find({ category: parentCategory._id })
                        if (list.length == 0) {
                            errorMessage = 'برای این دسته بندی هیج مشخصاتی ثبت نشده است'
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

        getAllProductSpecsDetails: async (param, args, { check, isAdmin }) => {
            if (check && isAdmin) {
                let errorMessage = 'امکان نمایش ریز مشخصات وجود ندارد'
                try {

                    const productSpecs = await ProductSpecs.findById(args.specsId);
                    if (!productSpecs) {
                        errorMessage = 'این مشخصات ثبت نشده است'
                        throw error;
                    }

                    const proSpecsDetailsList = await ProductSpecsDetails.find({ specs: args.specsId })
                    if (proSpecsDetailsList.length == 0) {
                        errorMessage = 'برای این مورد هیج مشخصاتی ثبت نشده است'
                        throw error;
                    }

                    return proSpecsDetailsList

                } catch {
                    const error = new Error('Input Error');
                    error.data = errorMessage;
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

        getAllSeller: async (param, args, { check, isAdmin }) => {
            if (check && isAdmin) {
                let errorMessage = 'امکان نمایش فروشنده ها وجود ندارد'
                try {
                    const category = await Category.findOne({ _id: args.categoryId }).populate('parent').exec();
                    if (!category) {
                        errorMessage = 'دسته بندی قبلا ثبت نشده است';
                        throw error
                    }
                    if (category.parent !== null) {
                        errorMessage = 'دسته بندی صحیح نمی باشد';
                        throw error
                    }

                    const sellerList = await Seller.find({ category: args.categoryId })
                    if (sellerList.length == 0) {
                        errorMessage = 'برای این دسته بندی هیج فروشنده ای ثبت نشده است'
                        throw error;
                    }

                    return sellerList;

                } catch {
                    const error = new Error('Input Error');
                    error.data = errorMessage;
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

        getAllSlider: async (param, args, { check, isAdmin }) => {
            if (check && isAdmin) {
                let errorMessage = 'امکان نمایش اسلایدر ها وجود ندارد';
                try {
                    const sliders = await Slider.find({});
                    if (sliders.length == 0) {
                        errorMessage = 'اسلایدری در سیستم ثبت نشده است';
                        throw error;
                    }

                    return sliders;

                } catch {
                    const error = new Error('Input Error');
                    error.data = errorMessage;
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

        getDefaultSlider: async (param, args) => {
            try {
                const slider = await Slider.findOne({ default: true });
                return slider;

            } catch {
                const error = new Error('Input Error');
                error.data = "not Found";
                error.code = 401;
                throw new GraphQLError(error.data, {
                    extensions: { code: error.code },
                });
            }
        },

        getProductInfo: async (param, args, { check, isAdmin }) => {
            if (check && isAdmin) {
                let errorMessage = 'دسترسی به اطلاعات امکان پذیر نیست';
                try {

                    if (!args.input.isSubCategory && validator.isEmpty(args.input.categoryId)) {
                        errorMessage = 'دسته اصلی را انتخاب نمایید';
                        throw error
                    } else if (args.input.isSubCategory && validator.isEmpty(args.input.subCategoryId)) {
                        errorMessage = 'زیر دسته را انتخاب نمایید';
                        throw error
                    }

                    if (!args.input.isSubCategory) {
                        const category = await Category.findById(args.input.categoryId);
                        if (!category || category.parent != null) {
                            errorMessage = 'درسته اصلی معتبر نمی باشد'
                            throw error;
                        }

                        const sellers = await Seller.find({ category: args.input.categoryId });
                        if (!sellers) {
                            errorMessage = 'هیچ فروشنده ای برای این دسته بندی ثبت نشده است'
                            throw error;
                        }

                        return {
                            sellers
                        }

                    } else if (args.input.isSubCategory) {
                        const category = await Category.findById(args.input.subCategoryId).populate('parent').exec();
                        if (!category || category.parent.parent != null) {
                            errorMessage = ' زیر درسته معتبر نمی باشد'
                            throw error;
                        }

                        const brands = await Brand.find({ category: args.input.subCategoryId });
                        const subCategory = await Category.find({ parent: args.input.subCategoryId });
                        const specs = await ProductSpecs.find({ category: args.input.subCategoryId });

                        return {
                            brands,
                            subCategory,
                            specs
                        }
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
                console.log(args.input)
                const error = new Error('Input Error');
                error.data = 'دسترسی شما به اطلاعات مسدود شده است';
                error.code = 401;
                throw new GraphQLError(error.data, {
                    extensions: { code: error.code },
                });
            }
        },

        getAllProduct: async (param, args) => {
            let errorMessage = 'دسترسی به اطلاعات امکان پذیر نمی باشد'

            const page = args.page || 1;
            const limit = args.limit || 10;

            try {
                if (args.productId) {
                    const product = await Product.findById(args.productId);
                    if (!product) {
                        errorMessage = 'چنین محصولی در سیستم ثبت نشده است'
                        throw error
                    }

                    return [product];

                } else if (!args.productId) {
                    const product = await Product.paginate({}, { page, limit });
                    if (product.length == 0) {
                        errorMessage = 'محصولی برای نمایش وجود ندارد'
                        throw error
                    }

                    return product.docs;
                }

            } catch {
                const error = new Error('Input Error');
                error.data = errorMessage;
                error.code = 401;
                throw new GraphQLError(error.data, {
                    extensions: { code: error.code },
                });
            }
        },

        getAllComment: async (param, args) => {
            try {
                let errorMessage = 'دسترسی به اطلاعات امکان پذیر نمی باشد'
                const page = args.page || 1;
                const limit = args.limit || 10;

                if (!args.input.productId && !args.input.commentId) {
                    const comments = await Comment.paginate({}, { page, limit });
                    return comments.docs;

                } else if (args.input.productId) {
                    const product = await Product.findById(args.input.productId);
                    if (!product) {
                        errorMessage = 'چنین محصولی در سیستم ثبت نشده است'
                        throw error;
                    }

                    const comments = await Comment.paginate({ product: args.input.productId }, { page, limit });
                    return comments.docs;

                } else if (!args.input.productId && args.input.commentId) {
                    const comment = await Comment.findById(args.input.commentId);
                    return [comment]
                }

            } catch {
                const error = new Error('Input Error');
                error.data = errorMessage;
                error.code = 401;
                throw new GraphQLError(error.data, {
                    extensions: { code: error.code },
                });
            }
        },

        getUsers: async (param, args, { check, isAdmin }) => {
            if (check && isAdmin) {
                try {
                    if (!args.userId) {
                        const users = await User.find();
                        return users;
                    } else {
                        const user = await User.findById(args.userId);
                        return [user];
                    }

                } catch {
                    const error = new Error('Input Error');
                    error.data = 'دسترسی به اطلاعات امکان پذیر نیست';
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

        getAllOrderStatus: async (param, args, { check, isAdmin }) => {
            if (check && isAdmin) {
                try {
                    const orderStatus = await OrderStatus.find();
                    return orderStatus;
                } catch {
                    const error = new Error('Input Error');
                    error.data = 'دسترسی به اطلاعات امکان پذیر نیست';
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

        getAllPayment: async (param, args, { check, isAdmin }) => {
            if (check && isAdmin) {
                try {
                    let page = 1 || args.page;
                    let limit = 10 || args.limit;

                    if (!args.orderId) {
                        const order = await Payment.paginate({}, { page, limit, sort: { createdAt: -1 } });
                        return order.docs;
                    } else {
                        const order = await Payment.findById(args.orderId);
                        return [order];
                    }

                } catch {
                    const error = new Error('Input Error');
                    error.data = 'دسترسی به اطلاعات امکان پذیر نیست';
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
    },

    Mutation: {
        register: async (param, args) => {
            let errorMessage = 'ثبت اطلاعات امکان پذیر نیست';
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
            if (check && isAdmin) {
                try {
                    const { createReadStream, filename } = await args.image;
                    const stream = createReadStream();
                    const { filePath } = await saveImage({ stream, filename });

                    await Multimedia.create({
                        name: filename,
                        dir: filePath
                    })

                    return {
                        status: 200,
                        message: 'تصاویر در رسانه ذخیره شد'
                    }

                } catch {
                    const error = new Error('Input Error');
                    error.data = 'امکان ذخیره عکس وجود ندارد';
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

        category: async (param, args, { check, isAdmin }) => {
            if (check && isAdmin) {
                let errorMessage = 'ذخیره دسته بندی امکان پذیر نیست';
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
                    // const { filePath } = await saveImage({ stream, filename });

                    // if (validator.isEmpty(filePath)) {
                    //     errorMessage = 'تصویر را نمی توانید خالی بگذارید'
                    //     throw error;
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
                        image: "/uploads/2023/7/brand.jpg"
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

        productSpecs: async (param, args, { check, isAdmin }) => {
            if (check && isAdmin) {
                let errorMessage = 'ذخیره مشخصات امکان پذیر نیست';
                try {

                    if (validator.isEmpty(args.input.specs)) {
                        errorMessage = 'نام را وارد نمایید'
                        throw error;
                    }
                    if (validator.isEmpty(args.input.category)) {
                        errorMessage = 'دسته بندی را وارد نمایید'
                        throw error;
                    }

                    if (!await Category.findOne({ _id: args.input.category })) {
                        errorMessage = 'دسته بندی قبلا ثبت نشده است';
                        throw error
                    }

                    const category = await Category.findOne({ _id: args.input.category }).populate('parent').exec();
                    if (category.parent.parent !== null) {
                        errorMessage = 'دسته بندی صحیح نمی باشد';
                        throw error
                    }

                    if (await ProductSpecs.findOne({ category: args.input.category, specs: args.input.specs })) {
                        errorMessage = 'برای این دسته بندی مشخصه ای با این نام قبلا ثبت شده است';
                        throw error
                    }

                    const proSpecs = await ProductSpecs.create({
                        category: args.input.category,
                        specs: args.input.specs,
                        label: args.input.label
                    })

                    return {
                        _id: proSpecs._id,
                        status: 200,
                        message: 'مشخصات دسته بندی مورد نظر ذخیره شد'
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

        productSpecsDetails: async (param, args, { check, isAdmin }) => {
            if (check && isAdmin) {
                let errorMessage = 'ذخیره ریز مشخصات امکان پذیر نیست';
                try {

                    if (validator.isEmpty(args.input.name)) {
                        errorMessage = 'نام را وارد نمایید'
                        throw error;
                    }
                    if (validator.isEmpty(args.input.specs)) {
                        errorMessage = 'مشخصات را وارد نمایید'
                        throw error;
                    }

                    if (!await ProductSpecs.findOne({ _id: args.input.specs })) {
                        errorMessage = 'مشخصات قبلا ثبت نشده است';
                        throw error
                    }

                    if (await ProductSpecsDetails.findOne({ specs: args.input.specs, name: args.input.name })) {
                        errorMessage = 'این مورد قبلا ثبت شده است';
                        throw error
                    }

                    const proSpecsDetails = await ProductSpecsDetails.create({
                        specs: args.input.specs,
                        name: args.input.name,
                        label: args.input.label
                    })

                    return {
                        _id: proSpecsDetails._id,
                        status: 200,
                        message: ' ریز مشخصات مورد نظر ذخیره شد'
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

        seller: async (param, args, { check, isAdmin }) => {
            if (check && isAdmin) {
                let errorMessage = 'ذخیره فروشنده امکان پذیر نیست';
                try {

                    if (validator.isEmpty(args.input.name)) {
                        errorMessage = 'نام فروشنده را وارد نمایید'
                        throw error;
                    }
                    if (validator.isEmpty(args.input.category)) {
                        errorMessage = ' دسته بندی را وارد نمایید'
                        throw error;
                    }

                    const category = await Category.findOne({ _id: args.input.category }).populate('parent').exec();
                    if (!category) {
                        errorMessage = 'دسته بندی قبلا ثبت نشده است';
                        throw error
                    }
                    if (category.parent !== null) {
                        errorMessage = 'دسته بندی صحیح نمی باشد';
                        throw error
                    }

                    if (await Seller.findOne({ category: args.input.category, name: args.input.name })) {
                        errorMessage = 'این فروشنده قبلا ثبت شده است';
                        throw error
                    }

                    const seller = await Seller.create({
                        category: args.input.category,
                        name: args.input.name,
                        label: args.input.label
                    });

                    return {
                        _id: seller._id,
                        status: 200,
                        message: 'فروشنده به درستی ذخیره شد '
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

        slider: async (param, args, { check, isAdmin }) => {
            if (check && isAdmin) {
                let errorMessage = 'ذخیره اسلایدر امکان پذیر نیست';
                try {

                    if (validator.isEmpty(args.input.name)) {
                        errorMessage = 'نام اسلایدر را وارد نمایید'
                        throw error;
                    }
                    if (args.input.images.length == 0) {
                        errorMessage = ' تصاویر را وارد نمایید'
                        throw error;
                    }

                    if (args.input.default) {
                        const defaultSlider = await Slider.findOne({ default: true });
                        if (defaultSlider) {
                            errorMessage = 'اسلایدر پیش فرض قبلا انتخاب شده است'
                            throw error;
                        }
                    }

                    const duplicatedSlider = await Slider.findOne({ name: args.input.name })
                    if (duplicatedSlider) {
                        errorMessage = 'اسلایدر با این نام قبلا ذخیره  شده است '
                        throw error;
                    }

                    const slider = await Slider.create({
                        name: args.input.name,
                        images: args.input.images,
                        default: args.input.default
                    });

                    return {
                        _id: slider._id,
                        status: 200,
                        message: 'اسلایدر ذخیره شد'
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

        product: async (param, args, { check, isAdmin }) => {
            if (check && isAdmin) {
                let errorMessage = 'ذخیره محصول امکان پذیر نیست';
                let attributes = [];
                let details = [];
                try {
                    const product = await Product.findOne({ $or: [{ persianName: args.input.persianName }, { englishName: args.input.englishName }] })
                    if (product) {
                        errorMessage = 'محصولی با عنوان مشابه قبلا ذخیره شده است'
                        throw error;
                    }

                    if (validator.isEmpty(args.input.persianName)) {
                        errorMessage = 'نام  فارسی را وارد نمایید'
                        throw error;
                    }
                    if (validator.isEmpty(args.input.englishName)) {
                        errorMessage = 'نام  انگلیسی را وارد نمایید'
                        throw error;
                    }
                    if (validator.isEmpty(args.input.category)) {
                        errorMessage = ' دسته بندی  را وارد نمایید'
                        throw error;
                    }
                    if (validator.isEmpty(args.input.brand)) {
                        errorMessage = ' برند را وارد نمایید'
                        throw error;
                    }

                    if (args.input.attribute.length == 0) {
                        errorMessage = 'ویژگی های محصول را وارد نمایید'
                        throw error;
                    }
                    if (args.input.details.length == 0) {
                        errorMessage = ' مشخصات محصول را وارد نمایید'
                        throw error;
                    }

                    const category = await Category.findById(args.input.category);
                    const brand = await Brand.findById(args.input.brand);

                    if (!category || category.parent == null) {
                        errorMessage = 'دسته بندی مورد نظر صحیح نمی باشد'
                        throw error;
                    }
                    if (!brand) {
                        errorMessage = ' برند مورد نظر صحیح نمی باشد'
                        throw error;
                    }


                    attributes = await saveProductAttribute(args.input.attribute);
                    details = await saveDetailsValue(args.input.details);

                    if (attributes.length == 0 || details.length == 0)
                        throw error

                    // console.log(args.input.original)
                    // const { createReadStream, filename } = await args.input.original;
                    // const stream = createReadStream();
                    // const { filePath } = await saveImage({ stream, filename });

                    await Product.create({
                        persianName: args.input.persianName,
                        englishName: args.input.englishName,
                        rate: null,
                        category: args.input.category,
                        brand: args.input.brand,
                        attribute: attributes,
                        details: details,
                        description: args.input.description,
                        original: null
                    });

                    return {
                        status: 200,
                        message: 'محصول مورد نظر ذخیره شد'
                    }

                } catch {

                    await deleteProductAttribute(attributes);
                    await deleteDetailsValue(attributes);

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

        updateProductAttribute: async (param, args, { check, isAdmin }) => {
            if (check && isAdmin) {
                let errorMessage = ' ویرایش محصول امکان پذیر نیست';
                try {
                    if (args.input.productId && args.input.isAddSeller) {
                        const attribute = await saveProductAttribute(args.input.attribute);
                        await Product.findByIdAndUpdate(args.input.productId, {
                            $push: {
                                attribute: attribute[0]
                            }
                        });

                        return {
                            status: 200,
                            message: 'فروشنده جدید به محصول اضافه شد'
                        }
                    } else if (!args.input.isAddSeller) {
                        for (let index = 0; index < args.input.attribute.length; index++) {
                            const element = args.input.attribute[index];
                            console.log(element._id)
                            await ProductAttribute.findOneAndUpdate({ _id: element._id }, {
                                $set: {
                                    color: element.color,
                                    stock: element.stock,
                                    price: element.price,
                                    discount: element.discount
                                }
                            })
                        }

                        return {
                            status: 200,
                            message: 'فروشنده محصول ویرایش شد'
                        }
                    } else {
                        throw error;
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

        updateProductImages: async (param, args, { check, isAdmin }) => {
            if (check && isAdmin) {
                let errorMessage = ' ویرایش محصول امکان پذیر نیست';
                try {
                    if (validator.isEmpty(args.productId) || args.imagesId.length == 0) {
                        errorMessage = 'اطلاعات ارسال شده معتبر نمی باشد';
                        throw error;
                    }

                    const product = await Product.findById(args.productId);
                    if (!product) {
                        errorMessage = 'چنین محصولی در سیستم ثبت نشده است';
                        throw error;
                    }

                    product.set({ images: args.imagesId });
                    await product.save();

                    return {
                        status: 200,
                        message: 'گالری محصول ویرایش شد'
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

        updateProduct: async (param, args, { check, isAdmin }) => {
            if (check && isAdmin) {
                let errorMessage = 'ویرایش محصول امکان پذیر نیست';
                try {
                    const prod = await Product.findOne({ $or: [{ persianName: args.input.persianName }, { englishName: args.input.englishName }] })
                    if (prod._id != args.input._id) {
                        errorMessage = 'محصولی با عنوان مشابه قبلا ذخیره شده است'
                        throw error;
                    }

                    if (validator.isEmpty(args.input.persianName)) {
                        errorMessage = 'نام  فارسی را وارد نمایید'
                        throw error;
                    }
                    if (validator.isEmpty(args.input.englishName)) {
                        errorMessage = 'نام  انگلیسی را وارد نمایید'
                        throw error;
                    }

                    if (validator.isEmpty(args.input.brand)) {
                        errorMessage = ' برند را وارد نمایید'
                        throw error;
                    }

                    if (args.input.details.length == 0) {
                        errorMessage = ' مشخصات محصول را وارد نمایید'
                        throw error;
                    }

                    const brand = await Brand.findById(args.input.brand);
                    if (!brand) {
                        errorMessage = ' برند مورد نظر صحیح نمی باشد'
                        throw error;
                    }

                    const details = await updateDetailsValue(args.input.details);
                    if (details.length == 0)
                        throw error


                    const product = await Product.findById(args.input._id);
                    let imageDir = ""

                    if (args.input.original == null) {
                        imageDir = product.original
                    } else {
                        const { createReadStream, filename } = await args.input.original;
                        const stream = createReadStream();
                        const { filePath } = await saveImage({ stream, filename });
                        imageDir = filePath;
                    }

                    product.set({
                        persianName: args.input.persianName,
                        englishName: args.input.englishName,
                        brand: args.input.brand,
                        details: details,
                        description: args.input.description,
                        original: imageDir
                    });

                    await product.save();

                    return {
                        status: 200,
                        message: 'محصول مورد نظر ویرایش شد'
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

        updateSlider: async (param, args, { check, isAdmin }) => {
            if (check && isAdmin) {
                let errorMessage = 'ویرایش اسلایدر امکان پذیر نیست';
                try {

                    const slider = await Slider.findById(args.input.sliderId);

                    if (validator.isEmpty(args.input.name)) {
                        errorMessage = 'نام اسلایدر را وارد نمایید'
                        throw error;
                    }

                    if (args.input.images.length == 0) {
                        errorMessage = ' تصاویر را وارد نمایید'
                        throw error;
                    }

                    if (slider == null) {
                        errorMessage = 'اسلایدر مورد نظر در سیستم ثبت نشده است'
                        throw error;
                    }

                    if (slider.default && !args.input.default) {
                        errorMessage = 'یک اسلایدر باید در حالت پیش فرض باشد'
                        throw error;
                    }


                    if (!slider.default && args.input.default) {
                        await Slider.findOneAndUpdate({ default: true }, { $set: { default: false } });
                    }

                    slider.set({
                        name: args.input.name,
                        images: args.input.images,
                        default: args.input.default
                    });

                    await slider.save();

                    return {
                        status: 200,
                        message: 'اسلایدر مورد نظر ویرایش شد'
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

        updateSeller: async (param, args, { check, isAdmin }) => {
            if (check && isAdmin) {
                let errorMessage = 'ویرایش فروشنده امکان پذیر نیست';
                try {

                    const seller = await Seller.findById(args.input.sellerId);

                    if (validator.isEmpty(args.input.name)) {
                        errorMessage = 'نام فروشنده را وارد نمایید'
                        throw error;
                    }

                    if (seller == null) {
                        errorMessage = 'فروشنده مورد نظر در سیستم ثبت نشده است'
                        throw error;
                    }

                    seller.set({
                        name: args.input.name,
                        label: args.input.label
                    });

                    await seller.save();

                    return {
                        status: 200,
                        message: 'فروشنده مورد نظر ویرایش شد'
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

        orderStatus: async (param, args, { check, isAdmin }) => {
            if (check && isAdmin) {
                let errorMessage = 'ذخیره وضعیت سفارش امکان پذیر نمی باشد';
                try {
                    if (validator.isEmpty(args.input.name)) {
                        errorMessage = 'عنوان وضعیت سفارش را وارد نمایید';
                        throw error
                    }

                    const orderstatus = await OrderStatus.findOne({ name: args.input.name })
                    if (orderstatus) {
                        errorMessage = 'وضعیت سفارشی با این نام قبلا ذخیره شده است';
                        throw error
                    }

                    if (args.input.default) {
                        const orderstatus = await OrderStatus.findOne({ default: args.input.default })
                        if (orderstatus) {
                            errorMessage = 'قبلا وضعیت سفارش پیش فرض انتخاب شده است';
                            throw error
                        }
                    }

                    // const { createReadStream, filename } = await args.image;
                    // const stream = createReadStream();
                    // const { filePath } = await saveImage({ stream, filename });

                    await OrderStatus.create({
                        name: args.input.name,
                        image: "/uploads/2023/7/4.svg",
                        default: args.input.default
                    });

                    return {
                        status: 200,
                        message: 'وضعیت سفارش ذخیره شد'
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

        updateOrderStatus: async (param, args, { check, isAdmin }) => {
            if (check && isAdmin) {
                let errorMessage = 'ویرایش وضعیت سفارش امکان پذیر نیست';
                try {

                    const orderStatus = await OrderStatus.findById(args.input.orderStatusId);

                    if (validator.isEmpty(args.input.name)) {
                        errorMessage = 'عنوان وضعیت را وارد نمایید'
                        throw error;
                    }

                    if (orderStatus == null) {
                        errorMessage = 'وضعیت مورد نظر در سیستم ثبت نشده است'
                        throw error;
                    }

                    if (!orderStatus.default && args.input.default) {
                        await OrderStatus.findOneAndUpdate({ default: true }, { $set: { default: false } });
                    }

                    orderStatus.set({
                        name: args.input.name,
                        default: args.input.default
                    });

                    await orderStatus.save();

                    return {
                        status: 200,
                        message: 'وضعیت سفارش  مورد نظر ویرایش شد'
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

        comment: async (param, args, { check }) => {
            console.log(args.input)
            if (check) {
                let errorMessage = 'ذخیره کامنت امکان پذیر نمی باشد';

                try {

                    const product = await Product.findById(args.input.product);
                    if (!product) {
                        errorMessage = 'چنین محصولی در سیستم ثبت نشده است';
                        throw error;
                    }

                    if (validator.isEmpty(args.input.text)) {
                        errorMessage = 'کامنت را وارد نمایید';
                        throw error;
                    }

                    const surveyValues = await saveSurveyValues(args.input.survey);

                    await Comment.create({
                        user: check.id,
                        product: args.input.product,
                        survey: surveyValues,
                        text: args.input.text
                    });

                    return {
                        status: 200,
                        message: 'کامنت درج شد'
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

        addLike: async (param, args, { check }) => {
            if (check) {
                let errorMessage = 'لایک کردن کامنت امکان پذیر نمی باشد';
                let hasLike = false;
                try {
                    const comment = await Comment.findById(args.commentId);

                    if (comment.disLike.length != 0) {
                        comment.disLike.map(item => {
                            if (item == check.id) {
                                const index = comment.disLike.indexOf(check.id)
                                if (index > -1) {
                                    comment.disLike.splice(index, 1);
                                }
                            }
                        })
                    }

                    comment.like.map(item => {
                        if (item == check.id) {
                            hasLike = true
                        }
                    });


                    if (hasLike) {
                        const index = comment.like.indexOf(check.id);

                        if (index > -1) {
                            comment.like.splice(index, 1);
                        }
                        await comment.save();

                        return {
                            status: 200,
                            message: 'عملیات انحام شد!'
                        }

                    } else {
                        comment.like.push(check.id);
                        await comment.save();

                        return {
                            status: 200,
                            message: 'لایک شد'
                        }
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

        addDisLike: async (param, args, { check }) => {
            if (check) {
                let errorMessage = 'دیس لایک کردن کامنت امکان پذیر نمی باشد';
                let hasDisLike = false;
                try {
                    const comment = await Comment.findById(args.commentId);

                    if (comment.like.length != 0) {
                        comment.like.map(item => {
                            if (item == check.id) {
                                const index = comment.like.indexOf(check.id);
                                if (index > -1) {
                                    comment.like.splice(index, 1);
                                }
                            }
                        })
                    }

                    comment.disLike.map(item => {
                        if (item == check.id) {
                            hasDisLike = true
                        }
                    });


                    if (hasDisLike) {
                        const index = comment.disLike.indexOf(check.id);

                        if (index > -1) {
                            comment.disLike.splice(index, 1);
                        }
                        await comment.save();

                        return {
                            status: 200,
                            message: 'عملیات انحام شد!'
                        }

                    } else {
                        comment.disLike.push(check.id);
                        await comment.save();

                        return {
                            status: 200,
                            message: 'دیس لایک شد'
                        }
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

        favorite: async (param, args, { check }) => {
            if (check) {
                let errorMessage = 'لیست علاقمندی موجود نمی باشد';
                try {

                    const product = await Product.findById(args.productId);
                    if (!product) {
                        errorMessage = 'چنین محصولی در سیستم ثبت نشده است';
                        throw error;
                    }

                    const favorite = await Favorite.findOne({ $and: [{ user: check.id }, { product: args.productId }] });
                    if (favorite) {
                        await favorite.remove();

                        return {
                            status: 200,
                            message: 'محصول از لیست علاقمندی خارج شد'
                        }

                    } else {
                        await Favorite.create({
                            user: check.id,
                            product: args.productId
                        });

                        return {
                            status: 200,
                            message: 'محصول به لیست علاقمندی اضافه شد'
                        }
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

        payment: async (param, args, { check, info }) => {
            console.log(check)
            if (check) {
                let errorMessage = 'امکان نهایی کردن سفارش وجود نداردُ';
                try {
                    let price = 0;
                    const orderStatus = await OrderStatus.findOne({ default: true });

                    if (info.length == 0) {
                        const attribute = await args.input.products.map(item => item.attribute);

                        for (let index = 0; index < attribute.length; index++) {
                            const element = attribute[index];
                            const productAttribute = await ProductAttribute.findById(element);
                            if (productAttribute.count == 0) {
                                const removeIndex = attribute.indexOf(productAttribute._id);
                                args.input.products.splice(removeIndex, 1);
                                errorMessage = 'موجودی محصول کافی نمیباشد';
                                throw errorMessage
                            } else {
                                price += (productAttribute.price - ((productAttribute.price * productAttribute.discount) / 100));
                            }
                        }

                        //*  Online payment process *////

                        await Payment.create({
                            user: check.id,
                            products: args.input.products,
                            discount: args.input.discount,
                            count: args.input.count,
                            price: (price - ((price * args.input.discount) / 100)),
                            orderStatus: orderStatus._id
                        });

                        return {
                            status: 200,
                            message: 'ok'
                        }

                    } else {
                        errorMessage = 'اطلاعات حساب کاربری شما کامل نشده است';
                        throw error;
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

        updatePayment: async (param, args, { check, isAdmin }) => {
            if (check && isAdmin) {
                let errorMessage = 'ویرایش وضعیت سفارش امکان پذیر نیست';
                try {
                    const payment = await Payment.findById(args.paymentId);

                    payment.set({
                        orderStatus: args.orderStatusId
                    });

                    await payment.save();

                    return {
                        status: 200,
                        message: 'وضعیت سفارش  مورد نظر ویرایش شد'
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

        deleteSlider: async (param, args, { check, isAdmin }) => {
            if (check && isAdmin) {
                let errorMessage = 'حذف اسلایدر امکان پذیر نیست';
                try {

                    const slider = await Slider.findById(args.sliderId);

                    if (slider.default) {
                        errorMessage = 'امکان حدف اسلایدر پیش فرض وجود ندارد';
                        throw error;
                    }

                    await Slider.deleteOne(slider);

                    return {
                        status: 200,
                        message: ' اسلایدر  مورد نظر حذف شد'
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

        updateUser: async (param, args, { check, isAdmin }) => {
            if (check) {
                let errorMessage = 'ویرایش اطلاعات امکان پذیر نیست';
                try {
                    const user = await User.findById(args.input.userId);

                    user.set({
                        fname: args.input.fname,
                        lname: args.input.lname,
                        address: args.input.address,
                        code: args.input.code,
                        gender: args.input.gender,
                    });

                    await user.save();

                    return {
                        status: 200,
                        message: ' اطلاعات مورد نظر ویرایش شد'
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

    // relationship of Types 

    Category: {
        parent: async (param, args) => await Category.findOne({ _id: param.parent }),
        image: async (param, args) => await Multimedia.findOne({ _id: param.image })
    },
    Brand: {
        category: async (param, args) => await Category.find({ _id: param.category })
    },
    Survey: {
        category: async (param, args) => await Category.findOne({ _id: param.category })
    },
    Slider: {
        image: async (param, args) => await Multimedia.find({ _id: param.images })
    },
    Specs: {
        details: async (param, args) => await ProductSpecsDetails.find({ specs: param._id })
    },
    Product: {
        category: async (param, args) => await Category.findById(param.category),
        brand: async (param, args) => await Brand.findById(param.brand),
        images: async (param, args) => await Multimedia.find({ _id: param.images }),
        attribute: async (param, args) => await ProductAttribute.find({ _id: param.attribute }),
        details: async (param, args) => await ProductDetails.find({ _id: param.details }),
    },
    Attribute: {
        seller: async (param, args) => await Seller.findById(param.seller),
    },
    Details: {
        productSpecsDetails: async (param, args) => await ProductSpecsDetails.findById(param.productSpecsDetails),
    },
    SpecsDetails: {
        specs: async (param, args) => await ProductSpecs.findById(param.specs)
    },
    Comment: {
        survey: async (param, args) => await SurveyValues.find({ _id: param.survey }),
        product: async (param, args) => await Product.findById(param.product),
        user: async (param, args) => await User.findById(param.user),
    },
    SurveyValue: {
        survey: async (param, args) => await Survey.findById(param.survey)
    },
    User: {
        favorite: async (param, args) => await Favorite.find({ user: param._id }),
        comment: async (param, args) => await Comment.find({ user: param._id }),
        payment: async (param, args) => await Payment.find({ user: param._id })
    },
    Payment: {
        user: async (param, args) => await User.findById(param.user),
        orderStatus: async (param, args) => await OrderStatus.findById(param.orderStatus),
        products: async (param, args) => {
            let prdt = []
            for (let i = 0; i < param.products.length; i++)
                prdt.push(await Product.findById(param.products[i].product))

            return prdt
        },
        attribute: async (param, args) => {
            let att = []
            for (let i = 0; i < param.products.length; i++)
                att.push(await ProductAttribute.findById(param.products[i].attribute))

            return att
        },
    },
    Favorite: {
        product: async (param, args) => await Product.findById(param.product),
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

let saveProductAttribute = async (attributes) => {
    try {
        let errorMessage = 'ذخیره ویژگی محصول امکان پذیر نیست'
        const attributeList = [];

        for (let index = 0; index < attributes.length; index++) {
            const element = attributes[index]
            const seller = await Seller.findById(element.seller)

            if (!seller) {
                errorMessage = ' فروشنده مورد نظر صحیح نمی باشد'
                throw error;
            }

            const productAttribute = await ProductAttribute.create({
                seller: seller,
                color: element.color,
                stock: element.stock,
                price: element.price,
                discount: element.discount
            })

            attributeList[index] = productAttribute._id
        }

        return attributeList;

    } catch {
        const error = new Error('Input Error');
        error.data = errorMessage;
        error.code = 401;
        throw new GraphQLError(error.data, {
            extensions: { code: error.code },
        });
    }
}

let saveDetailsValue = async (details) => {
    try {
        let errorMessage = 'ذخیره مشخصات محصول امکان پذیر نیست'
        const detailsList = [];

        for (let index = 0; index < details.length; index++) {
            const element = details[index]
            const productSpecsDetails = await ProductSpecsDetails.findById(element.productSpecsDetails)

            if (!productSpecsDetails) {
                errorMessage = 'چنین مشخصاتی در سیستم ثبت نشده است'
                throw error;
            }

            if (element.value.length == 0) {
                element.value = 'ندارد'
            }

            const productAttribute = await ProductDetails.create({
                productSpecsDetails: productSpecsDetails,
                value: element.value
            })

            detailsList[index] = productAttribute._id
        }

        return detailsList;

    } catch {
        const error = new Error('Input Error');
        error.data = errorMessage;
        error.code = 401;
        throw new GraphQLError(error.data, {
            extensions: { code: error.code },
        });
    }
}

let deleteProductAttribute = async (attributes) => {
    for (let index = 0; index < attributes.length; index++) {
        const element = attributes[index];
        await ProductAttribute.deleteOne({ _id: element });
    }
    return;
}

let deleteDetailsValue = async (details) => {
    for (let index = 0; index < details.length; index++) {
        const element = details[index];
        await ProductDetails.deleteOne({ _id: element });
    }
    return;
}

let updateDetailsValue = async (details) => {
    try {
        let errorMessage = ' ویرایش مشخصات محصول امکان پذیر نیست'
        const detailsList = [];

        for (let index = 0; index < details.length; index++) {
            const element = details[index]
            const productDetails = await ProductDetails.findById(element._id)

            if (!productDetails) {
                errorMessage = 'چنین مقداری برای مشخصات در سیستم ثبت نشده است'
                throw error;
            }

            if (element.value.length == 0) {
                element.value = 'ندارد'
            }

            productDetails.set({
                value: element.value
            })

            await productDetails.save();

            detailsList[index] = productDetails._id
        }

        return detailsList;

    } catch {
        const error = new Error('Input Error');
        error.data = errorMessage;
        error.code = 401;
        throw new GraphQLError(error.data, {
            extensions: { code: error.code },
        });
    }
}

let saveSurveyValues = async (survey) => {
    try {
        let surveyValueList = [];

        for (let index = 0; index < survey.length; index++) {
            const element = survey[index];

            const surveyValue = await SurveyValues.create({
                survey: element.survey,
                value: element.value
            });

            surveyValueList[index] = surveyValue._id;
        }

        return surveyValueList;

    } catch {
        const error = new Error('Input Error');
        error.data = 'امکان ذخیره معیار امتیازدهی برای کامنت وجود ندارد';
        error.code = 401;
        throw new GraphQLError(error.data, {
            extensions: { code: error.code },
        });
    }
}

module.exports = resolvers;