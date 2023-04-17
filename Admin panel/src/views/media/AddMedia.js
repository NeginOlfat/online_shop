import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from 'react-router-dom';
import {
    CButton,
    CCard,
    CCardBody,
    CCardHeader,
    CCardFooter,
    CForm,
    CFormLabel,
    CInputGroup,
    CFormInput,
    CProgress,
    CProgressBar
} from '@coreui/react'
import CIcon from '@coreui/icons-react';
import { cilX } from '@coreui/icons';
import { ToastContainer } from 'react-toastify';
import axios from "axios";

import { AuthContext } from 'src/context/auth/AuthContext';
import { checkType, maxSelectedFile, checkFileSize } from "./Funcs";

import classes from './media.module.css';
import 'react-toastify/dist/ReactToastify.css';


const AddMedia = () => {

    let navigate = useNavigate();

    const [loadedFiles, setLoadedFiles] = useState([]);
    const { dispatch } = useContext(AuthContext);

    useEffect(() => {
        dispatch({ type: 'check', payload: navigate });
    }, []);

    const OnFilesLoad = (event) => {
        const files = event.target.files;
        if (checkType(files) && maxSelectedFile(files) && checkFileSize(files)) {
            const newLoadedFile = [...loadedFiles];
            for (let i = 0; i < files.length; i++) {
                newLoadedFile.push({
                    files: files[i],
                    preview: URL.createObjectURL(files[i]),
                    loaded: 0
                })
            }
            setLoadedFiles(newLoadedFile);
        }
    }

    const removeLoadedFile = (file) => {
        const newFile = loadedFiles.filter((item) => item != file);
        setLoadedFiles(newFile);
    }

    const onDragOverHandler = (e) => {
        e.preventDefault();
    }

    const onDropHandler = (e) => {
        e.preventDefault();
        const files = e.dataTransfer.files;
        if (checkType(files) && maxSelectedFile(files) && checkFileSize(files)) {
            console.log(files)
            const newLoadedFile = [...loadedFiles];
            for (let i = 0; i < files.length; i++) {
                newLoadedFile.push({
                    file: files[i],
                    preview: URL.createObjectURL(files[i]),
                    loaded: 0
                })
            }
            setLoadedFiles(newLoadedFile);
        }
    }

    const uploadFiles = () => {
        const tmpLoadedFiles = [...loadedFiles];
        for (let i = 0; i < loadedFiles.length; i++) {
            if (loadedFiles[i] !== 100) {
                let data = {
                    query: `
                        mutation addmultimedia($image: Upload!){
                            multimedia(image: $image) {
                                status,
                                message
                             }
                        }
                    `,
                    variables: {
                        image: null
                    },
                }

                let map = {
                    0: ['variables.image']
                }

                const formData = new FormData();
                formData.append('operations', JSON.stringify(data));
                formData.append('map', JSON.stringify(map));
                formData.append(0, loadedFiles[i].files, loadedFiles[i].files.name);

                axios({
                    url: '/',
                    method: 'post',
                    data: formData,
                    headers: {
                        'Apollo-Require-Preflight': true,
                        'X-Apollo-Operation-Name': true,
                        'Content-Type': 'application/json',
                    },
                    onUploadProgress: ProgressEvent => {
                        tmpLoadedFiles[i].loaded = ProgressEvent.loaded / ProgressEvent.total * 100;
                    }
                }).then((response) => {
                    if (response.data.errors) {
                        const { message } = response.data.errors[0]
                        toast.error(message)
                    } else {
                        setLoadedFiles(tmpLoadedFiles)
                    }
                }).catch((error) => {
                    console.log(error.response.data.errors)
                })
            }
        }
    }

    return (
        <CCard>
            <ToastContainer />
            <CCardHeader>
                <h6>اضافه کردن پرونده چند رسانه ای</h6>
            </CCardHeader>
            <CCardBody>
                <div className={classes.addMediaSection}
                    onDragOver={onDragOverHandler}
                    onDrop={onDropHandler}
                >
                    <div className={classes.filePreview}>

                        {
                            loadedFiles.map((file, index) => {
                                return (
                                    <div className={classes.file} key={index}>
                                        {
                                            file.loaded === 0 ?
                                                <span className={classes.removeIcon} onClick={() => removeLoadedFile(file)} >
                                                    <CIcon icon={cilX} size="lg" />
                                                </span>
                                                : null
                                        }
                                        <img src={file.preview} alt={file.preview} />
                                        <CProgress className="mb-1">
                                            <CProgressBar color="success" value={file.loaded} >
                                                {Math.round(file.loaded, 2)}%
                                            </CProgressBar>
                                        </CProgress>
                                    </div>
                                )
                            })
                        }

                    </div>
                    <div className={classes.dragDropSection}>
                        <h3>پرونده ها را بکشید</h3>
                        <span>یا</span>
                        <CForm >
                            <CInputGroup>
                                <CFormLabel htmlFor="file-multiple-input">
                                    <div className={classes.fileSelection}>گزینش پرونده</div>
                                </CFormLabel>
                                <CFormInput
                                    type="file"
                                    id="file-multiple-input"
                                    name="file-multiple-input"
                                    multiple
                                    onChange={OnFilesLoad}
                                />
                            </CInputGroup>
                        </CForm>
                    </div>
                </div>
            </CCardBody>
            <CCardFooter>
                <CButton type="submit" color="primary" onClick={uploadFiles}><strong>آپلود</strong></CButton>
            </CCardFooter>
        </CCard>
    )
};

export default AddMedia;