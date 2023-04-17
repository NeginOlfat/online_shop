import { toast } from 'react-toastify';

export const checkType = (files) => {
    let err = '';
    const types = ['image/png', 'image/jpeg', 'image/jpg'];
    for (let i = 0; i < files.length; i++) {
        if (types.every(type => type !== files[i].type)) {
            err = 'لطفا یکی از فرمت های png یا jpg یا jpeg را انتخاب نمایید';
        }
    }
    if (err !== '') {
        event.target.value = null;
        toast.error(err);
        return false;
    }
    return true;
}

export const maxSelectedFile = (files) => {
    let err = '';
    if (files.length > 5) {
        err = 'شما نمیتوانید همزمان بیش از 5 عکس را بارگذاری کنید';
        toast.error(err);
        return false;
    }
    return true;
}

export const checkFileSize = (files) => {
    let err = '';
    const size = 3000000
    for (let i = 0; i < files.length; i++) {
        if (files[i].size > size) {
            err += files[i].name + 'حجم فایل زیادتر از حد مجاز است'
        }
    }
    if (err !== '') {
        event.target.value = null;
        toast.error(err);
        return false;
    }
    return true;
}