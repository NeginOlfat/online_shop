const validator = require('validator');
const bcrypt = require('bcryptjs');
const { GraphQLError } = require('graphql');

const User = require('../app/models/users');


const resolvers = {

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

        }

    }
}

module.exports = resolvers;