import React from "react";
import {
  CRow,
  CCol,
  CFormInput
} from '@coreui/react'

export const Specification = (props) => {
  return (
    <CRow key={props.item._id}>
      <CCol className="mb-3" xs='6'>
        <CFormInput
          size="sm"
          className="mb-3"
          value={props.item.name}
          disabled
        />
      </CCol>
      <CCol className="mb-3" xs='6'>
        <CFormInput
          size="sm"
          className="mb-3"
          value={props.item.value}
          onChange={(event) => props.valueHandler(event, props.idx, props.index)}
          required
        />
      </CCol>
    </CRow>
  )
}
