import React, { useReducer, useEffect } from 'react';
import request from '../_helpers/requests';
import { SYSTEM_REPORTS } from '../_helpers/apis';
import hrmis_request from '../_helpers/requests';

const ACTIONS = {
  MAKE_REQUEST: 'make-request',
  GET_DATA: 'get-data',
  ERROR: 'error',
  POST_DATA: 'POST_DATA',
};

function reducer(state, action) {
  switch (action.type) {
    case ACTIONS.MAKE_REQUEST:
      return { loading: true, reports: null };
    case ACTIONS.GET_DATA:
      return { ...state, loading: false, reports: action.payload.reports };
    case ACTIONS.ERROR:
      return {
        ...state,
        loading: false,
        error: action.payload.error,
        reports: null,
      };
    default:
      return state;
  }
}
export default function useFetchReports(params) {
  const [state, dispatch] = useReducer(reducer, {
    reports: null,
    loading: true,
  });

  useEffect(() => {
    if (params === null) return;
    if (!params?.reportName) return;
    if (params.reportName === null) return;
    if (params.fromHrmis) {
      dispatch({ type: ACTIONS.MAKE_REQUEST });
      hrmis_request
        .get(SYSTEM_REPORTS, { params: { ...params } })
        .then((res) => {
          dispatch({
            type: ACTIONS.GET_DATA,
            payload: { reports: res.data },
          });
        })
        .catch((e) => {
          // if (request.isCancel(e)) return
          dispatch({ type: ACTIONS.ERROR, payload: { error: e } });
        });
    } else {
      dispatch({ type: ACTIONS.MAKE_REQUEST });
      request
        .get(SYSTEM_REPORTS, { params: { ...params } })
        .then((res) => {
          dispatch({ type: ACTIONS.GET_DATA, payload: { reports: res.data } });
        })
        .catch((e) => {
          // if (request.isCancel(e)) return
          dispatch({ type: ACTIONS.ERROR, payload: { error: e } });
        });
    }

    // return () => {// on umount cancel any request
    //     source.cancel()
    // }
  }, [params.reportName]);
  return state;
}
