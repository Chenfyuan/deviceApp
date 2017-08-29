/**
 * 
 * 定义常量全局url
 * linweijian
 */
export const HOST = 'http://120.241.64.28:8181/ems/';
//export const HOST='http://192.168.0.122:8300/ems/';
//export const HOST='http://192.168.1.113:8300/ems/';
//export const HOST = 'http://120.241.64.28:9991/ems/';
//登陆
export const  LOGIN_URL=`${HOST}appSubmit.do`;
//设备列表
export const GETASSETLIST=`${HOST}asset/assetList.do`;
//主界面图片路径
export const HOME_ICON=`${HOST}images/common/func/`;
//查找个人信息
export const MY_INFO=`${HOST}core/user/appviewSelf.do`;
//检验密码是否正确
export const CHECK_PASSWORD=`${HOST}core/user/checkPassword.do`;
//修改密码
export const UPDATE_PASSWORD=`${HOST}core/user/appUpdatePass.do`;
//修改个人信息
export const UPDATE_INFO=`${HOST}core/user/appUpdateInfo.do`;
//查找台账信息
export const EQUIP_LIST=`${HOST}equipment/list.do`;
//保养管理
export const EQUIP_KEEP=`${HOST}jbpm/form/showForm.do?formId=eq_keep_EQKEEP01`;
//待办工单
export const JOBORDER_LIST=`${HOST}jbpm/task/appList.do`;
//待办任务操作
export const DO_JOBORDER=`${HOST}jbpm/form/taskForm.do`;
//消息列表
export const MSG_LIST=`${HOST}msg/list.do`;
//表单
export const SHOW_FORM=`${HOST}jbpm/form/showForm.do`;
//获取设备部位
export const EQUIPMENT_PART_URL=`${HOST}ems/equipmentJson/getEquipmentPart.do`
 //已完成工单
export const COMPLETEDJOBORDER_LIST=`${HOST}jbpm/task/completedList.do`;
//点检计划列表
export const DIANJIAN_LIST=`${HOST}ems/equipCheckPlan/list.do`;
//保养计划列表
export const BAOYANG_LIST=`${HOST}ems/equipKeepPlan/list.do`;
//统计分析
export const TONGJI_URL=`${HOST}analysis/appAnalysisIndex.do.do`
