const express = require('express')
const router = express.Router()
const cookieParser = require('cookie-parser')

router.use(cookieParser())
router.get('/checkAuth.do', (req, res) => {
  console.log('check auth', req.cookies)
  res.status(200).send('SUCCESS')
})
router.get('/actionLogin.do', (req, res) => {
  /*res.cookie('id', req.query.userId, {maxAge: 90000})
  res.setHeader('Content-Type', 'text/html');
  res.setHeader('X-Foo', req.query.userId);
  res.writeHead(200, { 'Content-Type': 'text/plain', 'Set-Cookie' : ['test_cookie = test', 'domain = localhost']});*/
  const is = req.query.userId === 'administrator' && req.query.userPwd === '1234'
  const data = {userNm: '관리자', result: is}
  res.status(200).send({data})
})
router.get('/actionLogout.do', (req, res) => {
  res.status(200).send({isSuccess: true})
})
// 요청진행 - 서비스 유형
router.get('/request/type.do', (req, res) => {
  const data = [
    {"reqTypeId":"RT00000001","reqTypeNm":"개발 요청(상주 협력사)-01"},
    {"reqTypeId":"RT00000002","reqTypeNm":"개발 요청(비상주 협력사)"},
    {"reqTypeId":"DRT00000000006","reqTypeNm":"장애신고"},
    {"reqTypeId":"DRT00000000007","reqTypeNm":"문제해결 요청"},
    {"reqTypeId":"DRT00000000009","reqTypeNm":"릴리즈 일반요청"},
    {"reqTypeId":"DRT00000000010","reqTypeNm":"구성등록 요청"},
    {"reqTypeId":"RT00000017","reqTypeNm":"인프라지원요청"},
    {"reqTypeId":"RT00000004","reqTypeNm":"데이터 수정요청-04"},
    {"reqTypeId":"RT00000005","reqTypeNm":"자료추출 요청-05"},
    {"reqTypeId":"RT00000018","reqTypeNm":"IoCare"},
    {"reqTypeId":"RT00000007","reqTypeNm":"긴급배포"},
    {"reqTypeId":"RT00000006","reqTypeNm":"개발요청(상주 ITO_테스트중)"},
    {"reqTypeId":"RT00000010","reqTypeNm":"문제관리"},
    {"reqTypeId":"RT00000014","reqTypeNm":"IT서비스지원요청"},
    {"reqTypeId":"RT00000008","reqTypeNm":"권한요청"},
    {"reqTypeId":"RT00000009","reqTypeNm":"장애관리"}
  ]
  res.status(200).send({data})
})
// 요청진행 - 검색 목록
router.get('/request/list.do', (req, res) => {
  console.log(req.query)
  const {reqType, reqCode, fromDate, toDate} = req.query
  const dummy = [
    {"processStateCodeNm":"타당성 검토 요청","svcTypeCode":"05","svcId":"SR000000483","summaryDesc":"권한요청_181015_권한요청_181015_권한요청_181015","reqEmpNm":"강태성"},
    {"processStateCodeNm":"요청 처리완료","svcTypeCode":"05","svcId":"SR000000478","summaryDesc":"인프라지원요청-변경2_181015:)","reqEmpNm":"강태성"},
    {"processStateCodeNm":"요청자 팀장 반려","svcTypeCode":"05","svcId":"SR000000472","summaryDesc":"인프라지원요청_181015:)","reqEmpNm":"강태성"},
    {"processStateCodeNm":"타당성 검토 요청","svcTypeCode":"05","svcId":"SR000000471","summaryDesc":"개발요청 테스트#8","reqEmpNm":"강태성"},
    {"processStateCodeNm":"결재요청","svcTypeCode":"05","svcId":"SR000000470","summaryDesc":"개발요청 테스트#7","reqEmpNm":"강태성"},
    {"processStateCodeNm":"공수산정 완료","svcTypeCode":"05","svcId":"SR000000468","summaryDesc":"개발요청 테스트입니다.","reqEmpNm":"강태성"},
    {"processStateCodeNm":"결재요청","svcTypeCode":"05","svcId":"SR000000467","summaryDesc":"개발 요청입니다.","reqEmpNm":"강태성"},
    {"processStateCodeNm":"문제처리 시작","svcTypeCode":"04","svcId":"PN000000009","summaryDesc":"문제관리5_181015:)","reqEmpNm":"강태성"},
    {"processStateCodeNm":"결재요청","svcTypeCode":"05","svcId":"SR000000461","summaryDesc":"권한요청 테스트#5","reqEmpNm":"강태성"},
    {"processStateCodeNm":"결재요청","svcTypeCode":"05","svcId":"SR000000460","summaryDesc":"권한요청 테스트#3","reqEmpNm":"강태성"},
    {"processStateCodeNm":"결재요청","svcTypeCode":"05","svcId":"SR000000459","summaryDesc":"권한요청 테스트#2","reqEmpNm":"강태성"},
    {"processStateCodeNm":"결재요청","svcTypeCode":"05","svcId":"SR000000458","summaryDesc":"권한요청 테스트","reqEmpNm":"강태성"},
    {"processStateCodeNm":"결재요청","svcTypeCode":"05","svcId":"SR000000456","summaryDesc":"테스트","reqEmpNm":"강태성"},
    {"processStateCodeNm":"작업완료","svcTypeCode":"05","svcId":"SR000000445","summaryDesc":"권한요청4_181015:)","reqEmpNm":"강태성"},
    {"processStateCodeNm":"대기됨","svcTypeCode":"01","svcId":"IN000000005","summaryDesc":"장애관리_181015:)","reqEmpNm":"강태성"},
    {"processStateCodeNm":"설계 요청","svcTypeCode":"05","svcId":"SR000000453","summaryDesc":"게시판 엑셀 다운 기능 개발","reqEmpNm":"강태성"},
    {"processStateCodeNm":"문제분석 결과 승인","svcTypeCode":"04","svcId":"PN000000005","summaryDesc":"문제관리2_181015:)","reqEmpNm":"강태성"},
    {"processStateCodeNm":"결재요청","svcTypeCode":"05","svcId":"SR000000441","summaryDesc":"게시판 고정게시 요청","reqEmpNm":"강태성"},
    {"processStateCodeNm":"문제분석 결과 승인","svcTypeCode":"04","svcId":"PN000000004","summaryDesc":"문제 관리 테스트입니다.","reqEmpNm":"강태성"},
    {"processStateCodeNm":"문제분석 결과 승인","svcTypeCode":"04","svcId":"PN000000003","summaryDesc":"문제관리_181015:)","reqEmpNm":"강태성"},
    {"processStateCodeNm":"대기됨","svcTypeCode":"01","svcId":"IN000000004","summaryDesc":"장애 요청 테스트 입니다. ","reqEmpNm":"강태성"},
    {"processStateCodeNm":"재해결요청","svcTypeCode":"05","svcId":"SR000000451","summaryDesc":"권한요청 테스트_20181015_#2","reqEmpNm":"강태성"},
    {"processStateCodeNm":"요청 처리완료","svcTypeCode":"05","svcId":"SR000000449","summaryDesc":"IT서비스지원요청3_181015:)","reqEmpNm":"강태성"},
    {"processStateCodeNm":"BA 테스트 반려","svcTypeCode":"05","svcId":"SR000000447","summaryDesc":"비상주 개발요청 테스트_20181015_1","reqEmpNm":"강태성"},
    {"processStateCodeNm":"합의일 변경요청","svcTypeCode":"05","svcId":"SR000000442","summaryDesc":"권한요청181015:)","reqEmpNm":"강태성"},
    {"processStateCodeNm":"타당성 검토 요청","svcTypeCode":"05","svcId":"SR000000443","summaryDesc":"권한 요청 테스트 입니다. ","reqEmpNm":"강태성"}
  ]
  let data = dummy
  if (reqCode) {
    data = dummy.filter(d => {
      return d.svcTypeCode === reqCode
    })
  }
  res.status(200).send({data})
})
// 요청정보 - 상세
router.get('/request/info.do', (req, res) => {
  console.log(req.query)
  const data = [
    // {"processStateCodeNm":"접수","customerReqDatetime":"2018-10-15","svcTypeCode":"05","detail1Desc":"test","svcId":"SR000000481","recipientEmpNm":"이윤주/ITSM","summaryDesc":"test","reqEmpNm":"신재철/ITSM","reqTypeNm":"개발 요청(상주 협력사)"}
    {"reqEmpNo":"20017111","reqEmpDeptNm":"정보전략팀","reqEmpNm":"강태성/정보전략팀","restoreStartDatetime":null,"reqPriorityLevelNm":"중간","solutionDesc":null,"reportDatetime":"2018-10-22 14:52:06","relRequestId":null,"processStateNm":"배포계획서 작성중","divisionCode":"2","assignEmpNo":null,"customerContactNo":null,"inchargeOfcpsNm":null,"assignUserNms":null,"returnMessage":"반려사유 : UAT 완료합니다.","relChangeId":null,"customFieldInfoStr":null,"restoreEndDatetime":null,"addCiList":null,"svcTypeCode":"05","bindRequestList":null,"reqCompleteTime":null,"recipientMbtlnum":null,"sRequestSortCode":"01","startSvcId":null,"applicationFormNm":null,"reqEmpEmailAddr":"tskang@coway.co.kr","regEmpNo":"20017111","processStepNm":"처리","processStageNm":null,"transferSvcId":null,"reqReceiveChannelNm":"ITSM","relIncidentId":null,"memoDesc":null,"processStageByNum":"0","applicationFormDetail":"<p><br></p>","eduTargetUserList":null,"recipientEmpNo":"20017111","sRequestSortNm":"일반","middleSortCode":null,"applicationFormId":null,"recipientEmpNm":"강태성/정보전략팀","reqReceiveChannel":"06","transferRequestTypeCode":null,"processStageCode":"250","inFirstRankNm":"중간","processStepCategory":null,"inFirstRankCode":"02","processSortCode":"924","transferRequestTypeNm":null,"regDate":"2018-10-22 14:52:53","recipientEmpPositionCode":null,"reqTypeNm":"개발 요청(상주 협력사)","atchFileId":"ATCHFILE_40187526012","buttonNm":null,"applicationFormDesc":null,"satisfyEvalYn":"N","deletedFileList":null,"inchargeEmpDeptNm":"운영2팀","approveStageYn":null,"reqTypeId":"RT00000001","recipientEmpPositionNm":"팀원","summaryDesc":"전자결재 연동 양식 개발 요청","updateEmpNo":null,"custSatiCode":null,"ciId":null,"mainViewSearchKeyword":null,"approveCheckId":null,"priorityColor":null,"recipientEmailAdres":"tskang@coway.co.kr","middleSortCodeNm":null,"bigSortCodeNm":null,"processStateCode":"913","reqOfcpsNm":null,"noteDesc":null,"reqPriorityLevel":"02","customField3":null,"recipientEmpDeptNm":"정보전략팀","class":"class com.watchtek.watchall.itsm.servicereq.vo.SRequestVO","customField4":null,"customField1":null,"customField2":null,"customField7":null,"divisionNm":"인프라","bindRequestSubId":null,"customField8":null,"customField5":null,"reqUrgencyLevel":null,"customField6":null,"reqUrgencyLevelNm":null,"customField9":null,"svcId":"SR000000731","bigSortCode":null,"reqPositionNm":"팀원","inchargeEmpDeptId":null,"inchargeEmpNm":"김태년","detail1Desc":"<p>1. 전자결재 연동 양식 개발 요청 전자결재 연동 양식 개발 요청 2. 전자결재 연동 양식 개발 요청 전자결재 연동 양식 개발 요청 \n 3. 전자결재 연동 양식 개발 요청 전자결재 연동 양식 개발 요청<br/>4. 전자결재 연동 양식 개발 요청 전자결재 연동 양식 개발 요청</p>","reqCompleteDate":null,"demandItemList":null,"locale":null,"delCiList":null,"receiveChannelCode":"06","receiveChannelNm":"ITSM","customerEmailAddr":null,"customField12":null,"customField10":null,"smallSortCodeNm":null,"customField11":null,"smallSortCode":null,"custSatiNm":null,"srequestId":"SR000000731","multiAssignUserList":null,"inchargeEmpNo":"t1602012","customerName":null,"defverid":null,"reqEmpDeptId":null,"instId":"1322","priorityGrade":null,"reqEmpTelNo":null,"assignRoleTypeCode":null,"updateDate":"2018-10-22 15:20:54","hasApprovalInfo":"false","customerReqDatetime":"2018-10-22","processSortNm":null,"relatedSvcId":null,"processSortVer":"1003","bindRequestNm":null,"buttonReturnNm":null}
  ]

  res.status(200).send({data})
})
// 요청정보 - 진행정보
router.get('/request/history.do', (req, res) => {
  console.log(req.query)
  const data = [
    {"userNm":"강태성(팀원)","processStateCodeNm":"SR 요청","processStepCategoryNm":"결재요청","updateDate":"2018-10-15"},
    {"userNm":"남동오(팀장)","processStateCodeNm":"요청자 팀장 승인","processStepCategoryNm":"타당성 검토 요청","updateDate":"2018-10-15"},
    {"userNm":"강태성(팀원)","processStateCodeNm":"BA 요청 타당성 검토","processStepCategoryNm":"BA팀장 검토 요청","updateDate":"2018-10-15"},
    {"userNm":"남동오(팀장)","processStateCodeNm":"BA팀장 승인","processStepCategoryNm":"설계자 타당성 검토 요청","updateDate":"2018-10-15"},
    {"userNm":"이진우(파트너)","processStateCodeNm":"BA 견적검토","processStepCategoryNm":"공수산정 완료","updateDate":"2018-10-15"}
  ]
  res.status(200).send({data})
})
// 요청결재 - 내역
router.get('/approval/list.do', (req, res) => {
  const data = [
    {"processStateCodeNm":"타당성 검토 요청","svcTypeCode":"05","svcId":"SR000000471","summaryDesc":"개발요청_테스트_개발요청_테스트개발요청_테스트#8개발요청테스트","reqEmpNm":"정보전략팀/강태성"},
    {"processStateCodeNm":"공수산정 완료","svcTypeCode":"05","svcId":"SR000000468","summaryDesc":"ywAAAAAMAAwAAAC8IyPqcvt3wCcDkiLc7C0qwyGHhSWpjQu5yqmCYsapyuvUUlvONmOZtfzgFzByTB10QgxOR0TqBQejhRNzOfkVJ","reqEmpNm":"정보전략팀/강태성"},
    {"processStateCodeNm":"문제분석 보고 완료","svcTypeCode":"04","svcId":"PN000000010","summaryDesc":"문제관리 요청#1","reqEmpNm":"ITSM/어드민"}
  ]
  res.status(200).send({data})
})
// 요청결재 - 요청정보 상세
router.get('/approval/info.do', (req, res) => {
  // detail, edititem, viewitem
  const data = [
    // {"processStateCodeNm":"승인","customerReqDatetime":"2018-10-15","svcTypeCode":"05","detail1Desc":"​개발요청 테스트입니다.","svcId":"SR000000468","recipientEmpNm":"강태성/정보전략팀","summaryDesc":"개발요청 테스트입니다.","reqEmpNm":"강태성/정보전략팀","reqTypeNm":"개발 요청(상주 협력사)"}
    //{"detail":{"reqEmpNo":"20017111","reqEmpDeptNm":"정보전략팀","reqEmpNm":"강태성/정보전략팀","restoreStartDatetime":null,"reqPriorityLevelNm":"중간","solutionDesc":null,"reportDatetime":"2018-10-23 10:24:14","relRequestId":null,"processStateNm":"BA 검토 대기","divisionCode":"2","assignEmpNo":null,"customerContactNo":null,"inchargeOfcpsNm":null,"assignUserNms":null,"returnMessage":"반려사유 : 승인합니다.","relChangeId":null,"customFieldInfoStr":null,"restoreEndDatetime":null,"addCiList":null,"svcTypeCode":"05","bindRequestList":null,"reqCompleteTime":null,"recipientMbtlnum":null,"sRequestSortCode":"01","startSvcId":null,"applicationFormNm":null,"reqEmpEmailAddr":"tskang@coway.co.kr","regEmpNo":"20017111","processStepNm":"승인","processStageNm":null,"transferSvcId":null,"reqReceiveChannelNm":"ITSM","relIncidentId":null,"memoDesc":null,"processStageByNum":"0","applicationFormDetail":"<p><br></p>","eduTargetUserList":null,"recipientEmpNo":"20017111","sRequestSortNm":"일반","middleSortCode":null,"applicationFormId":null,"recipientEmpNm":"강태성/정보전략팀","reqReceiveChannel":"06","transferRequestTypeCode":null,"processStageCode":"030","inFirstRankNm":"중간","processStepCategory":null,"inFirstRankCode":"02","processSortCode":"924","transferRequestTypeNm":null,"regDate":"2018-10-23 19:24:48","recipientEmpPositionCode":null,"reqTypeNm":"개발 요청(상주 협력사)","atchFileId":"ATCHFILE_40290254614","buttonNm":null,"applicationFormDesc":null,"satisfyEvalYn":"N","deletedFileList":null,"inchargeEmpDeptNm":null,"approveStageYn":null,"reqTypeId":"RT00000001","recipientEmpPositionNm":"팀원","summaryDesc":"WT_개발요청_1023_004","updateEmpNo":null,"custSatiCode":null,"ciId":null,"mainViewSearchKeyword":null,"approveCheckId":null,"priorityColor":null,"recipientEmailAdres":"tskang@coway.co.kr","middleSortCodeNm":null,"bigSortCodeNm":null,"processStateCode":"896","reqOfcpsNm":null,"noteDesc":null,"reqPriorityLevel":"02","customField3":null,"recipientEmpDeptNm":"정보전략팀","class":"class com.watchtek.watchall.itsm.servicereq.vo.SRequestVO","customField4":null,"customField1":null,"customField2":null,"customField7":null,"divisionNm":"인프라","bindRequestSubId":null,"customField8":null,"customField5":null,"reqUrgencyLevel":null,"customField6":null,"reqUrgencyLevelNm":null,"customField9":null,"svcId":"SR000000769","bigSortCode":null,"reqPositionNm":"팀원","inchargeEmpDeptId":null,"inchargeEmpNm":null,"detail1Desc":"WT_개발요청_1023_004","reqCompleteDate":null,"demandItemList":null,"locale":null,"delCiList":null,"receiveChannelCode":"06","receiveChannelNm":"ITSM","customerEmailAddr":null,"customField12":null,"customField10":null,"smallSortCodeNm":null,"customField11":null,"smallSortCode":null,"custSatiNm":null,"srequestId":"SR000000769","multiAssignUserList":null,"inchargeEmpNo":null,"customerName":null,"defverid":null,"reqEmpDeptId":"0220028956G","instId":"1399","priorityGrade":null,"reqEmpTelNo":null,"assignRoleTypeCode":null,"updateDate":"2018-10-23 19:25:26","hasApprovalInfo":"false","customerReqDatetime":"2018-10-23","processSortNm":null,"relatedSvcId":null,"processSortVer":"1003","bindRequestNm":null,"buttonReturnNm":null},"editItem":[{"dataType":"CHECKBOX","frmItemNm":"기능개선유형 및 요건유형이 적절하게 분류되었는가?","frmItemId":"CFI000022"},{"dataType":"CHECKBOX","frmItemNm":"합의된 표준 요구사항정의서 양식으로 첨부되었는가? (단순개선인경우 확인완료로 체크)","frmItemId":"CFI000023"},{"dataType":"CHECKBOX","frmItemNm":"요구사항의 목적 및 배경이 명확하게 기술되었는가?","frmItemId":"CFI000024"},{"dataType":"CHECKBOX","frmItemNm":"요구사항정의(정책/규칙 변경, 비즈니스로직, 업무처리절차)가 명확하게 기술되고 견적 및 구현이 가능한가?","frmItemId":"CFI000025"},{"dataType":"CHECKBOX","frmItemNm":"기타 고려사항 및 제약조건이 명확하게 기술되고 구현이 가능한가?","frmItemId":"CFI000026"},{"dataType":"CHECKBOX","frmItemNm":"완료기준(인수기준)이 명확하고 선결사항은 해결되었는가?","frmItemId":"CFI000027"},{"dataType":"CHECKBOX","frmItemNm":"개인정보 포함여부 정합성 확인","frmItemId":"CFI000118"}]}
    {"detail":{"reqEmpNo":"20017111","reqEmpDeptNm":"정보전략팀","reqEmpNm":"강태성/정보전략팀","restoreStartDatetime":null,"reqPriorityLevelNm":"중간","solutionDesc":null,"reportDatetime":"2018-10-23 10:24:14","relRequestId":null,"processStateNm":"BA 검토 대기","divisionCode":"2","assignEmpNo":null,"customerContactNo":null,"inchargeOfcpsNm":null,"assignUserNms":null,"returnMessage":"반려사유 : 승인합니다.","relChangeId":null,"customFieldInfoStr":null,"restoreEndDatetime":null,"addCiList":null,"svcTypeCode":"05","bindRequestList":null,"reqCompleteTime":null,"recipientMbtlnum":null,"sRequestSortCode":"01","startSvcId":null,"applicationFormNm":null,"reqEmpEmailAddr":"tskang@coway.co.kr","regEmpNo":"20017111","processStepNm":"승인","processStageNm":null,"transferSvcId":null,"reqReceiveChannelNm":"ITSM","relIncidentId":null,"memoDesc":null,"processStageByNum":"0","applicationFormDetail":"<p><br></p>","eduTargetUserList":null,"recipientEmpNo":"20017111","sRequestSortNm":"일반","middleSortCode":null,"applicationFormId":null,"recipientEmpNm":"강태성/정보전략팀","reqReceiveChannel":"06","transferRequestTypeCode":null,"processStageCode":"030","inFirstRankNm":"중간","processStepCategory":null,"inFirstRankCode":"02","processSortCode":"924","transferRequestTypeNm":null,"regDate":"2018-10-23 19:24:48","recipientEmpPositionCode":null,"reqTypeNm":"개발 요청(상주 협력사)","atchFileId":"ATCHFILE_40290254614","buttonNm":null,"applicationFormDesc":null,"satisfyEvalYn":"N","deletedFileList":null,"inchargeEmpDeptNm":null,"approveStageYn":null,"reqTypeId":"RT00000001","recipientEmpPositionNm":"팀원","summaryDesc":"WT_개발요청_1023_004","updateEmpNo":null,"custSatiCode":null,"ciId":null,"mainViewSearchKeyword":null,"approveCheckId":null,"priorityColor":null,"recipientEmailAdres":"tskang@coway.co.kr","middleSortCodeNm":null,"bigSortCodeNm":null,"processStateCode":"896","reqOfcpsNm":null,"noteDesc":null,"reqPriorityLevel":"02","customField3":null,"recipientEmpDeptNm":"정보전략팀","class":"class com.watchtek.watchall.itsm.servicereq.vo.SRequestVO","customField4":null,"customField1":null,"customField2":null,"customField7":null,"divisionNm":"인프라","bindRequestSubId":null,"customField8":null,"customField5":null,"reqUrgencyLevel":null,"customField6":null,"reqUrgencyLevelNm":null,"customField9":null,"svcId":"SR000000769","bigSortCode":null,"reqPositionNm":"팀원","inchargeEmpDeptId":null,"inchargeEmpNm":null,"detail1Desc":"WT_개발요청_1023_004","reqCompleteDate":null,"demandItemList":null,"locale":null,"delCiList":null,"receiveChannelCode":"06","receiveChannelNm":"ITSM","customerEmailAddr":null,"customField12":null,"customField10":null,"smallSortCodeNm":null,"customField11":null,"smallSortCode":null,"custSatiNm":null,"srequestId":"SR000000769","multiAssignUserList":null,"inchargeEmpNo":null,"customerName":null,"defverid":null,"reqEmpDeptId":"0220028956G","instId":"1399","priorityGrade":null,"reqEmpTelNo":null,"assignRoleTypeCode":null,"updateDate":"2018-10-23 19:25:26","hasApprovalInfo":"false","customerReqDatetime":"2018-10-23","processSortNm":null,"relatedSvcId":null,"processSortVer":"1003","bindRequestNm":null,"buttonReturnNm":null},"editItem":[{"dataType":"TEXT","frmItemNm":"기능개선유형","frmItemId":"CFI000022"}, {"dataType":"TEXT","frmItemNm":"개발 타당성","frmItemId":"CFI000023"}], "viewItem":[{"frmItemVal":"Y","dataType":"CHECKBOX","frmItemNm":"개발 타당성 검토결과"},{"frmItemVal":"N","dataType":"CHECKBOX","frmItemNm":"계획공수합"}]}
    // {"detail":{"reqEmpNo":"20017111","reqEmpDeptNm":"정보전략팀","reqEmpNm":"강태성/정보전략팀","restoreStartDatetime":null,"reqPriorityLevelNm":"중간","solutionDesc":null,"reportDatetime":"2018-10-23 08:21:38","relRequestId":null,"processStateNm":"공수 승인 대기","divisionCode":"2","assignEmpNo":null,"customerContactNo":null,"inchargeOfcpsNm":null,"assignUserNms":null,"returnMessage":"반려사유 : 개발검토 및 공수산정 완료합니다.","relChangeId":null,"customFieldInfoStr":null,"restoreEndDatetime":null,"addCiList":null,"svcTypeCode":"05","bindRequestList":null,"reqCompleteTime":null,"recipientMbtlnum":null,"sRequestSortCode":"01","startSvcId":null,"applicationFormNm":null,"reqEmpEmailAddr":"tskang@coway.co.kr","regEmpNo":"20017111","processStepNm":"승인","processStageNm":null,"transferSvcId":null,"reqReceiveChannelNm":"ITSM","relIncidentId":null,"memoDesc":null,"processStageByNum":"0","applicationFormDetail":"<p><br></p>","eduTargetUserList":null,"recipientEmpNo":"20017111","sRequestSortNm":"일반","middleSortCode":null,"applicationFormId":null,"recipientEmpNm":"강태성/정보전략팀","reqReceiveChannel":"06","transferRequestTypeCode":null,"processStageCode":"100","inFirstRankNm":"중간","processStepCategory":null,"inFirstRankCode":"02","processSortCode":"924","transferRequestTypeNm":null,"regDate":"2018-10-23 17:22:18","recipientEmpPositionCode":null,"reqTypeNm":"개발 요청(상주 협력사)","atchFileId":"ATCHFILE_40282898089","buttonNm":null,"applicationFormDesc":null,"satisfyEvalYn":"N","deletedFileList":null,"inchargeEmpDeptNm":"운영1팀","approveStageYn":null,"reqTypeId":"RT00000001","recipientEmpPositionNm":"팀원","summaryDesc":"WT_개발요청_1023_001","updateEmpNo":null,"custSatiCode":null,"ciId":null,"mainViewSearchKeyword":null,"approveCheckId":null,"priorityColor":null,"recipientEmailAdres":"tskang@coway.co.kr","middleSortCodeNm":null,"bigSortCodeNm":null,"processStateCode":"902","reqOfcpsNm":null,"noteDesc":null,"reqPriorityLevel":"02","customField3":null,"recipientEmpDeptNm":"정보전략팀","class":"class com.watchtek.watchall.itsm.servicereq.vo.SRequestVO","customField4":null,"customField1":null,"customField2":null,"customField7":null,"divisionNm":"인프라","bindRequestSubId":null,"customField8":null,"customField5":null,"reqUrgencyLevel":null,"customField6":null,"reqUrgencyLevelNm":null,"customField9":null,"svcId":"SR000000765","bigSortCode":null,"reqPositionNm":"팀원","inchargeEmpDeptId":null,"inchargeEmpNm":"이경우","detail1Desc":"WT_개발요청_1023_001","reqCompleteDate":null,"demandItemList":null,"locale":null,"delCiList":null,"receiveChannelCode":"06","receiveChannelNm":"ITSM","customerEmailAddr":null,"customField12":null,"customField10":null,"smallSortCodeNm":null,"customField11":null,"smallSortCode":null,"custSatiNm":null,"srequestId":"SR000000765","multiAssignUserList":null,"inchargeEmpNo":"t1708020","customerName":null,"defverid":null,"reqEmpDeptId":"0220028956G","instId":"1393","priorityGrade":null,"reqEmpTelNo":null,"assignRoleTypeCode":null,"updateDate":"2018-10-23 19:23:51","hasApprovalInfo":"false","customerReqDatetime":"2018-10-23","processSortNm":null,"relatedSvcId":null,"processSortVer":"1003","bindRequestNm":null,"buttonReturnNm":null},"viewItem":[{"frmItemVal":"a","dataType":"TEXT","frmItemNm":"개발 타당성 검토결과"},{"frmItemVal":"10.5","dataType":"PLANMD","frmItemNm":"계획공수합"}]}
    //{"detail":{"reqEmpNo":"20014986","reqEmpDeptNm":"CL운영팀","reqEmpNm":"김반디/CL운영팀","restoreStartDatetime":null,"reqPriorityLevelNm":"중간","solutionDesc":null,"reportDatetime":"2018-10-29 11:19:41","relRequestId":null,"processStateNm":"공수 승인 대기","divisionCode":"2","assignEmpNo":null,"customerContactNo":null,"inchargeOfcpsNm":null,"assignUserNms":null,"returnMessage":"반려사유 : 개발검토 및 공수산정 완료합니다.","relChangeId":null,"customFieldInfoStr":null,"restoreEndDatetime":null,"addCiList":null,"svcTypeCode":"05","bindRequestList":null,"reqCompleteTime":null,"recipientMbtlnum":null,"sRequestSortCode":"01","startSvcId":null,"applicationFormNm":null,"reqEmpEmailAddr":"luna914@coway.co.kr","regEmpNo":"20014986","processStepNm":"승인","processStageNm":null,"transferSvcId":null,"reqReceiveChannelNm":"ITSM","relIncidentId":null,"memoDesc":null,"processStageByNum":"0","applicationFormDetail":"<p><br></p>","eduTargetUserList":null,"recipientEmpNo":"20014986","sRequestSortNm":"일반","middleSortCode":null,"applicationFormId":null,"recipientEmpNm":"김반디/CL운영팀","reqReceiveChannel":"06","transferRequestTypeCode":null,"processStageCode":"100","inFirstRankNm":"중간","processStepCategory":null,"inFirstRankCode":"02","processSortCode":"924","transferRequestTypeNm":null,"regDate":"2018-10-29 11:20:23","recipientEmpPositionCode":null,"reqTypeNm":"개발 요청(상주 협력사)","atchFileId":"ATCHFILE_40779581533","buttonNm":null,"applicationFormDesc":null,"satisfyEvalYn":"N","deletedFileList":null,"inchargeEmpDeptNm":"운영1팀","approveStageYn":null,"reqTypeId":"RT00000001","recipientEmpPositionNm":"팀원","summaryDesc":"모바일테스트_SAP-FI(수납)_개발요청(상주)_1029_2_김반디","updateEmpNo":null,"custSatiCode":null,"ciId":null,"mainViewSearchKeyword":null,"approveCheckId":null,"priorityColor":null,"recipientEmailAdres":"luna914@coway.co.kr","middleSortCodeNm":null,"bigSortCodeNm":null,"processStateCode":"902","reqOfcpsNm":null,"noteDesc":null,"reqPriorityLevel":"02","customField3":null,"recipientEmpDeptNm":"CL운영팀","class":"class com.watchtek.watchall.itsm.servicereq.vo.SRequestVO","customField4":null,"customField1":null,"customField2":null,"customField7":null,"divisionNm":"인프라","bindRequestSubId":null,"customField8":null,"customField5":null,"reqUrgencyLevel":null,"customField6":null,"reqUrgencyLevelNm":null,"customField9":null,"svcId":"SR000001013","bigSortCode":null,"reqPositionNm":"팀원","inchargeEmpDeptId":null,"inchargeEmpNm":"김혁수","detail1Desc":"","reqCompleteDate":null,"demandItemList":null,"locale":null,"delCiList":null,"receiveChannelCode":"06","receiveChannelNm":"ITSM","customerEmailAddr":null,"customField12":null,"customField10":null,"smallSortCodeNm":null,"customField11":null,"smallSortCode":null,"custSatiNm":null,"srequestId":"SR000001013","multiAssignUserList":null,"inchargeEmpNo":"t1512009","customerName":null,"defverid":null,"reqEmpDeptId":"0220008552G","instId":"1901","priorityGrade":null,"reqEmpTelNo":null,"assignRoleTypeCode":null,"updateDate":"2018-10-29 13:35:09","hasApprovalInfo":"false","customerReqDatetime":"2018-10-29","processSortNm":null,"relatedSvcId":null,"processSortVer":"1181","bindRequestNm":null,"buttonReturnNm":null},"viewItem":[{"frmItemVal":"이상무","dataType":"TEXT","frmItemNm":"개발 타당성 검토결과"},{"frmItemVal":"5 M/H","dataType":"PLANMD","frmItemNm":"계획공수합"}]}
  ]
  res.status(200).send({data})
})
// 요청결재 - 진행정보
router.get('/approval/history.do', (req, res) => {
  const data = [
    {"userNm":"강태성(팀원)","processStateCodeNm":"SR 요청","processStepCategoryNm":"결재요청","updateDate":"2018-10-15"},
    {"userNm":"남동오(팀장)","processStateCodeNm":"요청자 팀장 승인","processStepCategoryNm":"타당성 검토 요청","updateDate":"2018-10-15"},
    {"userNm":"강태성(팀원)","processStateCodeNm":"BA 요청 타당성 검토","processStepCategoryNm":"BA팀장 검토 요청","updateDate":"2018-10-15"},
    {"userNm":"남동오(팀장)","processStateCodeNm":"BA팀장 승인","processStepCategoryNm":"설계자 타당성 검토 요청","updateDate":"2018-10-15"},
    {"userNm":"이진우(파트너)","processStateCodeNm":"BA 견적검토","processStepCategoryNm":"공수산정 완료","updateDate":"2018-10-15"}
  ]
  res.status(200).send({data})
})
// 요청결재 - 승인
router.post('/approval/update.do', (req, res) => {
  console.log('approval update...', req.body.params)
  res.status(200).send({result: true})
})
// 완료확인 - 만족도 평가
router.get('/evaluation/list.do', (req, res) => {
  const data = [
    {"basicinfoSubdesc":"매우만족","basicinfoSubNm":"매우만족","basicinfoSubid":"01"},
    {"basicinfoSubdesc":"만족","basicinfoSubNm":"만족","basicinfoSubid":"02"},
    {"basicinfoSubdesc":"보통","basicinfoSubNm":"보통","basicinfoSubid":"03"},
    {"basicinfoSubdesc":"미흡","basicinfoSubNm":"미흡","basicinfoSubid":"04"},
    {"basicinfoSubdesc":"불만족","basicinfoSubNm":"불만족","basicinfoSubid":"05"}
  ]
  res.status(200).send({data})
})
// 만족도 평가 처리
router.post('/evaluation/update.do', (req, res) => {
  console.log('evaluation update...', req.body.params)
  res.status(200).send({result: true})
})

module.exports = router;