import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles, createStyleSheet } from 'material-ui/styles';
import Paper from 'material-ui/Paper';
import Avatar from 'material-ui/Avatar';
import List, {
	ListItem, ListItemSecondaryAction, ListItemText,
	ListSubheader,
} from 'material-ui/List';
import Typography from 'material-ui/Typography';
import TextField from 'material-ui/TextField';
import AppBar from 'material-ui/AppBar';
import Button from 'material-ui/Button';
import { LabelRadio, RadioGroup } from 'material-ui/Radio';
import { FormLabel, FormControl, FormControlLabel } from 'material-ui/Form';
import Dialog, {
	DialogActions,
	DialogContent,
	DialogContentText,
	DialogTitle,
} from 'material-ui/Dialog';
import Drawer from 'material-ui/Drawer';

import IconButton from 'material-ui/IconButton';
import BackIcon from 'material-ui-icons/ArrowBack';

import StudentCard from '../studentCard.js';

import { initCache, getData, getCity, getCourse, getRouter, getStudent, getCache,getAreas,getCourses } from '../../../utils/helpers';
import {
	UNROLL_STUDENT,
	DATA_TYPE_BASE,
	REMOVE_STUDENT,
	UPDATE_STUDENT,
	INSERT_STUDENT,
	QUERY,
	ENROLL_STUDENT,
	EXIT_CLASS,
	STATUS_ENROLLED,
	AGREE_ARRANGE,
	REFUSE_ARRANGE,
	DATA_TYPE_STUDENT,
	DATA_TYPE_RESITS,
	DATA_TYPE_UNLINE,
	DATA_TYPE_CANCEL_STUDENT,
	STATUS_ARRANGED_DOING,
	STATUS_ENROLLED_UNDO,
	STATUS_FK_UNDO,
	STATUS_ARRANGED_UNDO,
	STATUS_AGREED_AGREE,
	STATUS_ENROLLED_DID,
	STATUS_ARRANGED,
	STATUS_AGREED,
	CARD_TYPE_ENROLL,
	CARD_TYPE_FK,
	CARD_TYPE_ARRANGE,
	CARD_TYPE_UNARRANGE,
	CARD_TYPE_UNARRANGE_ING,
	STATUS_ARRANGED_DID,
	ALERT,
	STATUS_AGREED_KNOW,
	STATUS_AGREED_REFUSED,
	NOTICE,
	CARD_TYPE_KNOW,
	CLASS_INFO,
	APPLY_CANCEL,
	CHECK_IDENTITY_CARD,
	GET_UNLINE_ONE,
	COMPLETION_RESITINFO,
	RECALL_CANCEL,RESIT_REG,RECALL_RESIT,RESIT_CLASSINFO
} from '../../../enum';
import Lang from '../../../language';
import Code from '../../../code';

import CommonAlert from '../../../components/CommonAlert';

const Style = {
	paper: { margin: 10, width: 400, float: "left" }
}

class Resit extends Component {
	state = {
		course: "0",
		course_id: "",
		a_id: "",
		c_area_id: "",
		is_register: "",
		resit_idCard: "",
		must_cancel_reason: "",
		cancel_student_name: "",
		cancel_student_id: "",
		fkenrolled_height: 1,
		unarranged_height: 1,
		arranged_height: 1,
		unenrolled_height: 1,
		resit_height:1,
		resits:[],
		unline:[],
		students: [],
		cancel_students: [],
		areas: [],
		fkStudents: [],
		newStudents: [],
		unarragedStudents: [],
		arrangedStudents: [],
		resitStudent:[],
		unarrageResits:[],
		arrageResits:[],
		newStudents_comp: [],
		unarragedStudents_comp: [],
		arrangedStudents_comp: [],
		resitStudent_comp:[],
		unarrageResits_comp:[],
		arrageResits_comp:[],
		// 界面状态
		selectedStudentId: undefined,
		selected: {},
		showInfo: false,
		resitshowInfo: false,
		right: false,
		// 提示状态
		alertOpen: false,
		alertType: ALERT,
		alertCode: Code.LOGIC_SUCCESS,
		alertContent: "",
		alertAction: [],
		openNewStudentDialog: false,
		openResitCheck:false,
		check_resit_name:"",
		check_resit_course_id:"",
		check_resit_area_id:"",
		check_resit_identity_card:"",
		check_resit_id:"",
		check_resit_register:""
		
	};

	componentWillMount() {
		window.currentPage = this;
		this.fresh()
	}

	fresh = () => {
		initCache(this.cacheToState);
	}

	cacheToState() {
		// 设置界面
		var students = getCache(DATA_TYPE_STUDENT);
		var cancel_students = getCache(DATA_TYPE_CANCEL_STUDENT);
		var resits = getCache(DATA_TYPE_RESITS);
		var unline = getCache(DATA_TYPE_UNLINE);
	//	console.log(unline);
		window.currentPage.state.areas = getCache("areas");
		window.currentPage.state.students = students === undefined ? [] : students;
		window.currentPage.state.cancel_students = cancel_students === undefined ? [] : cancel_students;
		window.currentPage.state.resits = resits === undefined ? [] : resits;
		window.currentPage.state.unline = unline === undefined ? [] : unline;
		//console.log(this.state.students)
		window.currentPage.updateStudents();
		if(getCache(DATA_TYPE_BASE) !== undefined) {
			var data = getCache(DATA_TYPE_BASE);
			// var currentCity = getCity(data.c_area_id);
			// console.log(data.c_area_id)
			window.currentPage.setState({
				c_area_id: data.c_area_id,
			});
		}
	}
	resit_student = (id) => {
		var cb = (route, message, arg) => {
			if (message.code === Code.LOGIC_SUCCESS) {
				this.fresh();
			}
			this.popUpNotice(NOTICE, 0, message.msg);
		}
		getData(getRouter(RESIT_REG), { session: sessionStorage.session, user_ids: id }, cb, { });
	}
	//获取线下详细信息并效验是否重复报名
	gain_online_infos=(id)=>{
		var cb = (route, message, arg) => {
			if (message.code === Code.LOGIC_SUCCESS) {

				this.setState({
					resitright:false,
					openNewStudentDialog:true,
					check_resit_name:message.data.one_info.name,
					check_resit_course_id:message.data.one_info.course_id,
					check_resit_area_id:message.data.one_info.area_id,
					check_resit_identity_card:message.data.one_info.identity_card,
					check_resit_id:message.data.one_info.id,
					check_resit_register:message.data.one_info.register,
				})
				//this.fresh()

			}
          
			this.popUpNotice(NOTICE, 0, message.msg);
		}
		console.log(id)
		getData(getRouter(GET_UNLINE_ONE), { session: sessionStorage.session, id: id }, cb, { });
	}
	cancelResitStudent = (id) => {
		var cb = (route, message, arg) => {
			if (message.code === Code.LOGIC_SUCCESS) {
				this.fresh();
			}
			this.popUpNotice(NOTICE, 0, message.msg);
		}
		getData(getRouter(RECALL_RESIT), { session: sessionStorage.session, resit_id: id }, cb, { });
	}
	 updateStudents = () => {
		let fkStudents = [], newStudents = [], unarragedStudents = [], arrangedStudents = [],unarrageResits = [],arrageResits = [],arrangedStudents_comp=[],unarrageResits_comp=[],arrageResits_comp=[];
		for (var i = 0; i < this.state.students.length; i++) {
			if (this.state.students[i].is_inlist == STATUS_FK_UNDO) {
				fkStudents.push(this.state.students[i]);
			}
			if (this.state.students[i].is_inlist == STATUS_ENROLLED_UNDO) {
				newStudents.push(this.state.students[i]);
			}
			if (this.state.students[i].is_inlist == STATUS_ENROLLED_DID||this.state.students[i].is_inlist == STATUS_ARRANGED_DID) {
				unarragedStudents.push(this.state.students[i]);
			}
			if (this.state.students[i].is_inlist == 3) {
				if(this.state.students[i].course_id==1||this.state.students[i].course_id==2){
					arrangedStudents.push(this.state.students[i]);
				}
				if(this.state.students[i].course_id==3||this.state.students[i].course_id==4){
					arrangedStudents_comp.push(this.state.students[i]);
				}
			//	arrangedStudents.push(this.state.students[i]);
			}		
		}
		for(var i = 0; i < this.state.cancel_students.length; i++) {
			unarragedStudents.push(this.state.cancel_students[i]);
		}
		for(var i = 0; i < this.state.resits.length; i++) {
			console.log(this.state.resits)
			if (this.state.resits[i].state == 1) {
				if(this.state.resits[i].course_id==1||this.state.resits[i].course_id==2){
				unarrageResits.push(this.state.resits[i]);
			}
			if(this.state.resits[i].course_id==3||this.state.resits[i].course_id==4){
				unarrageResits_comp.push(this.state.resits[i]);
			}
		}
			if (this.state.resits[i].state == 2) {
				if(this.state.resits[i].course_id==1||this.state.resits[i].course_id==2){
				arrageResits.push(this.state.resits[i]);
			}
			if(this.state.resits[i].course_id==3||this.state.resits[i].course_id==4){
				arrageResits_comp.push(this.state.resits[i]);
			}
		}

		}
		this.setState({
			fkStudents: fkStudents,
			newStudents: newStudents,
			unarragedStudents: unarragedStudents,
			arrangedStudents: arrangedStudents,
			unarrageResits:unarrageResits,
			arrageResits:arrageResits,
			arrangedStudents_comp:arrangedStudents_comp,
			unarrageResits_comp:unarrageResits_comp,
			arrageResits_comp:arrageResits_comp
		})
	}

	// send_identity_card() {
	// 	var cb = (route, message, arg) => {
	// 		if (message.code === Code.LOGIC_SUCCESS) {
	// 		//	this.fresh();
	// 			this.handleRequestClose()
	// 			this.setState({
	// 			openNewStudentDialog:true,
	// 			check_resit_name:message.data.check_resitinfo.name,
	// 			check_resit_course_id:message.data.check_resitinfo.course_id,
	// 			check_resit_area_id:message.data.check_resitinfo.area_id,
	// 			check_resit_identity_card:message.data.check_resitinfo.identity_card,
	// 			check_resit_id:message.data.check_resitinfo.id,
	// 			check_resit_register:message.data.check_resitinfo.register,
				
	// 				})
	// 			}
			
	// 		this.popUpNotice(NOTICE, 0, message.msg);
	// 	}
	// 	getData(getRouter(CHECK_IDENTITY_CARD), {
	// 		session: sessionStorage.session,
	// 		identity_card: this.state.resit_idCard
	// 	}, cb, {});
	// }
	recall_cancel(id) {
		var cb = (route, message, arg) => {
			if(message.code === Code.LOGIC_SUCCESS) {
				this.fresh();
			}
			this.handleRequestClose()
			this.popUpNotice(NOTICE, 0, message.msg);
		}
		getData(getRouter(RECALL_CANCEL), {
			session: sessionStorage.session,
			cancel_id: id
		}, cb, {});
	}

	completion_resitinfo(student) {
		var cb = (route, message, arg) => {
			if (message.code === Code.LOGIC_SUCCESS) {
			//	window.CacheData.students.push(Object.assign(arg.student, { id: message.id }));
				this.fresh();
			}
			this.handleRequestClose()
			this.popUpNotice(NOTICE, 0, message.msg);
		}
		
		getData(getRouter(COMPLETION_RESITINFO), { session: sessionStorage.session,id:this.state.check_resit_id, info: student }, cb, { info: student });
	}

	selectedStudent(student) {
		this.state.selectedStudentId = student.id;
		this.state.selected = student;
		this.state.course = student.course_id;
	}
				newStudentDialog() {
					return (
						<Dialog open={this.state.openNewStudentDialog} onRequestClose={this.handleRequestClose} >
			<DialogTitle style={{marginLeft:"2rem"}}>
			未通过系统报名培训的学员信息登记
			</DialogTitle>
			<DialogContent>
			<div style={{paddingTop:20}} className="nyx-form">
			<TextField
			className="nyx-form-div nyx-must-content"
			key={"name"}
			id={"check_resit_name"}
			disabled={true}
			value={this.state.check_resit_name}
			label={Lang[window.Lang].pages.com.students.input.name}
			/>
			<div className="nyx-form-div">
			<TextField
			className="nyx-form-div nyx-must-content"
			key={"register"}
			value={this.state.check_resit_register}
			id={"check_resit_register"}
			disabled={true}
			label={"备注"}
			/>
			</div>
			<div className="nyx-info-select-div">
			<p className="nyx-info-select-label">课程名称</p>
			<select
			style={{borderBottom:"dashed 1px"}}
			className="nyx-info-select-lg"
			id="check_resit_course_id"
			disabled={true}
			value={this.state.check_resit_course_id}
			label={Lang[window.Lang].pages.org.clazz.info.area}
			>
			 {getCourses().map(course => {
                return <option key={course.id} value={course.id}>{course.course_name}</option>
             })}
			
			</select>
			</div>
			<div className="nyx-info-select-div">
			<p className="nyx-info-select-label">培训城市</p>
			<select
			style={{borderBottom:"dashed 1px"}}
			className="nyx-info-select-lg"
			id="check_resit_area_id"
			disabled={true}
			value={this.state.check_resit_area_id === null ? "" : this.state.check_resit_area_id}
			label={Lang[window.Lang].pages.org.clazz.info.area}
			>
			 {getAreas().map(area => {
                                    return <option key={area.id} value={area.id}>{area.area_name}</option>
                                })}
			</select>
			</div>
			<TextField
			className="nyx-form-div nyx-must-content"
			key={"identity_card"}
			id={"check_resit_identity_card"}
			disabled={true}
			value={this.state.check_resit_identity_card}
			label={"身份证号码"}
			/>
			<TextField
			className="nyx-form-div nyx-must-content"
			key={"mobile"}
			id={"check_resit_mobile"}
			label={Lang[window.Lang].pages.com.students.input.mobile}
			defaultValue={""}
			/>
			<TextField
			className="nyx-form-div nyx-must-content"
			key={"mail"}
			id={"check_resit_mail"}
			label={Lang[window.Lang].pages.com.students.input.mail}
			defaultValue={""}
			/>
			
			<TextField
			className="nyx-form-div"
			key={"department"}
			id={"check_resit_department"}
			label={Lang[window.Lang].pages.com.students.input.department}
			/>
			<TextField
			className="nyx-form-div"
			key={"duty"}
			id={"check_resit_duty"}
			label={Lang[window.Lang].pages.com.students.input.duty}
			/>
			<TextField
			className="nyx-form-div"
			key={"wechat"}
			id={"check_resit_wechat"}
			label={Lang[window.Lang].pages.com.students.input.wechat}
			/>
			</div>
			</DialogContent>
			<DialogActions>
			<div>
			<Button style={{backgroundColor:"#2196F3",color:"#FFF",marginRight:"1rem"}}
			onClick={() => {
			var check_resit_info_array={check_resit_mobile:"您没有输入手机",
			check_resit_mail:"您没有输入邮箱",
			check_resit_department:"您没有输入部门",check_resit_duty:"您没有输入职务"
			}
			for(var key in check_resit_info_array){
			if (document.getElementById(key).value === "") {
			this.popUpNotice(NOTICE, 0, check_resit_info_array[key])
			return
			}
			}
			this.completion_resitinfo({
			name: document.getElementById("check_resit_name").value,
			department: document.getElementById("check_resit_department").value,
			duty: document.getElementById("check_resit_duty").value,
			mobile: document.getElementById("check_resit_mobile").value,
			mail: document.getElementById("check_resit_mail").value,
			wechat: document.getElementById("check_resit_wechat").value,
			identity_card: document.getElementById("check_resit_identity_card").value,
			register: document.getElementById("check_resit_register").value,
			area_id: document.getElementById("check_resit_area_id").value,
			course_id: document.getElementById("check_resit_course_id").value
			})
			}}
			>
			{Lang[window.Lang].pages.main.certain_button}
			</Button>
			<Button style={{backgroundColor:"rgba(0, 0, 0, 0.12)"}}
			onClick={() => {
			this.handleRequestClose()
			}}
			>
			{Lang[window.Lang].pages.main.cancel_button}
			</Button>
			</div>
			</DialogActions>
			</Dialog>
					)
				}

				handleRequestClose = () => {
					this.setState({
						openNewStudentDialog: false,
						openResitCheck:false
					})
				}

				closeNotice = () => {
					this.setState({
						alertOpen: false,
					})
				}

				popUpNotice(type, code, content, action = [() => {
					this.setState({
						alertOpen: false,
					})
				}, () => {
					this.setState({
						alertOpen: false,
					})
				}]) {
					this.setState({
						alertType: type,
						alertCode: code,
						alertContent: content,
						alertOpen: true,
						alertAction: action
					});
				}

				toggleDrawer = (open) => () => {
					this.setState({
						showInfo: open,
						right: open,
					});
				};
				resitDrawer = (open) => () => {
					this.setState({
						resitshowInfo: open,
						resitright: open,
					});
				};

				handleChangeCourse = (event, value) => {
					this.setState({ course_id: value });
				};
				handleChangeCity = (event, value) => {
					this.setState({ course: value });
				};

	render() {
		return (
			<div style={{width:"800px"}} className={'nyx-page'}>
			<Paper className={'nyx-paper nyx-enroller-paper'}>
				<List style={{ padding: 0 }}>
				<div style={{  color:"#2196F3", marginBottom: "1rem", position: "relative" }} className="nyx-head-name">
				{"补考报名列表"} <i
								onClick={() => {
									if (this.state.resit_height == 0) {
									this.setState({ resit_height: 1 })
									} else {
									this.setState({ resit_height: 0 })
									}
									}}
                                className="glyphicon glyphicon-menu-down nyx-flexible" aria-hidden="true"></i>
                                	
									<Button style={{ position: "absolute", right: "28px", top: "0" }} fab color="primary" aria-label="add" className={'nyx-paper-header-btn'}
                                        onClick={() => {
                                            this.resitDrawer(true)()
                                        
                                        }}
                                        >
                                        {"报名"}
                                        </Button>

                </div>             
					<div className={this.state.resit_height ? "nyx-list-paper" : "nyx-list-paper-change"}>
					{sessionStorage.classify==1?this.state.unarrageResits.map(student =>
					<StudentCard
					type={CARD_TYPE_UNARRANGE}
					key={student.id}
					name={student.name === null ? "" : student.name.toString()}
					mobile={student.mobile === null ? "" : student.mobile.toString()}
					email={student.mail === null ? "" : student.mail.toString()}
					level={Number(student.course_id)}
					city={Number(student.area_id)}
					//duty={}
					//department={student.department === null ? "" : student.department.toString()}
					institution={student.institution === null ? "" : Number(student.institution)}
					is_inlist={student.is_inlist}
					action={[() => 
					 {
					this.popUpNotice(ALERT, 0, "取消" + student.name + "补考报名", [
					() => {
					this.cancelResitStudent(student.id);
					this.closeNotice();
					}, () => {
					this.closeNotice();
					}]);
					}, () => {
					this.state.selected = student;
					this.popUpNotice(ALERT, 0, "删除学生" + student.name, [
					() => {
					this.removeStudent(student.id);
					this.closeNotice();
					}, () => {
					this.closeNotice();
					}]);
					}]}>
					</StudentCard>
					):this.state.unarrageResits_comp.map(student =>
						<StudentCard
						type={CARD_TYPE_UNARRANGE}
						key={student.id}
						name={student.name === null ? "" : student.name.toString()}
						mobile={student.mobile === null ? "" : student.mobile.toString()}
						email={student.mail === null ? "" : student.mail.toString()}
						level={Number(student.course_id)}
						city={Number(student.area_id)}
						//duty={}
						//department={student.department === null ? "" : student.department.toString()}
						institution={student.institution === null ? "" : Number(student.institution)}
						is_inlist={student.is_inlist}
						action={[() => 
						 {
						this.popUpNotice(ALERT, 0, "取消" + student.name + "补考报名", [
						() => {
						this.cancelResitStudent(student.id);
						this.closeNotice();
						}, () => {
						this.closeNotice();
						}]);
						}, () => {
						this.state.selected = student;
						this.popUpNotice(ALERT, 0, "删除学生" + student.name, [
						() => {
						this.removeStudent(student.id);
						this.closeNotice();
						}, () => {
						this.closeNotice();
						}]);
						}]}>
						</StudentCard>
						)}
					{sessionStorage.classify==1?this.state.arrageResits.map(student =>
					<StudentCard
					type={CARD_TYPE_ARRANGE}
					key={student.id}
					name={student.name === null ? "" : student.name.toString()}
					mobile={student.mobile === null ? "" : student.mobile.toString()}
					email={student.mail === null ? "" : student.mail.toString()}
					level={Number(student.course_id)}
					city={Number(student.area_id)}
					//duty={}
					//department={student.department === null ? "" : student.department.toString()}
					institution={student.institution === null ? "" : Number(student.institution)}
					is_inlist={student.is_inlist}
					action={[() => 
						{
							this.state.selectedStudentId = student.id;
							var id = student.id;
							var cb = (router, message, arg) => {
							if (message.code === Code.LOGIC_SUCCESS) {
							}
							var class_head = message.data.resit_classinfo.class_head!=null?"班主任"+message.data.resit_classinfo.class_head:"";
							var mobile = message.data.resit_classinfo.mobile!=null?"-班主任电话"+message.data.resit_classinfo.mobile:"";
							var address = message.data.resit_classinfo.address!=null?"-地址"+message.data.resit_classinfo.address:"";
							var train_starttime = message.data.resit_classinfo.train_starttime!=null?"-开班时间"+message.data.resit_classinfo.train_starttime:"";
							var message_data= class_head!=""?class_head+mobile+address+train_starttime:"暂无班级安排"
							this.popUpNotice(ALERT, 0, message_data, [
							() => {
							//this.agreeArrange();
							this.closeNotice();
							}, () => {
							this.closeNotice();
							}]);
							}
							getData(getRouter(RESIT_CLASSINFO), { session: sessionStorage.session, resit_id: student.id }, cb, { id: id });
							}
						
				
					]}>
					</StudentCard>
					):this.state.arrageResits_comp.map(student =>
						<StudentCard
						type={CARD_TYPE_ARRANGE}
						key={student.id}
						name={student.name === null ? "" : student.name.toString()}
						mobile={student.mobile === null ? "" : student.mobile.toString()}
						email={student.mail === null ? "" : student.mail.toString()}
						level={Number(student.course_id)}
						city={Number(student.area_id)}
						//duty={}
						//department={student.department === null ? "" : student.department.toString()}
						institution={student.institution === null ? "" : Number(student.institution)}
						is_inlist={student.is_inlist}
						action={[() => 
							{
								this.state.selectedStudentId = student.id;
								var id = student.id;
								var cb = (router, message, arg) => {
								if (message.code === Code.LOGIC_SUCCESS) {
								}
								var class_head = message.data.resit_classinfo.class_head!=null?"班主任"+message.data.resit_classinfo.class_head:"";
								var mobile = message.data.resit_classinfo.mobile!=null?"-班主任电话"+message.data.resit_classinfo.mobile:"";
								var address = message.data.resit_classinfo.address!=null?"-地址"+message.data.resit_classinfo.address:"";
								var train_starttime = message.data.resit_classinfo.train_starttime!=null?"-开班时间"+message.data.resit_classinfo.train_starttime:"";
								var message_data= class_head!=""?class_head+mobile+address+train_starttime:"暂无班级安排"
								this.popUpNotice(ALERT, 0, message_data, [
								() => {
								//this.agreeArrange();
								this.closeNotice();
								}, () => {
								this.closeNotice();
								}]);
								}
								getData(getRouter(RESIT_CLASSINFO), { session: sessionStorage.session, resit_id: student.id }, cb, { id: id });
								}
							
					
						]}>
						</StudentCard>
						)}
					</div>
			</List>
			</Paper>
			{/* <div className={'nyx-tips'}>
			<p style={{marginBottom:0}}>需要报名补考，但未在本系统中进行报名的项目管理人员，请点击人员补录</p>
			<Button  style={{float:"left"}} color="primary" aria-label="add" className={'nyx-paper-header-btn'}
                                        onClick={() => {
											var info_completed=getCache("info_completed");
												var info_completed_per=info_completed/20;
												console.log(info_completed_per);
												if(info_completed_per<1){
												this.popUpNotice("alert", 0, '企业相关信息完成'+info_completed_per*100+'%, 请先补全企业相关信息');
												return
												}
											this.setState({
												openResitCheck:true,
												})
                                         //   this.resitDrawer(true)()
                                        
                                        }}
                                        >
                                        {"人员补录"}
                                        </Button>
			
			</div> */}
            
			
			<Drawer
                       
                        anchor="right"
                        open={this.state.resitright}
                        onRequestClose={this.resitDrawer(false)}
                    >
					 <div style={{width:"600px"}}> 
					 <span  style={{  color:"#2196F3",marginLeft:"2rem",top:"1rem",position:"relative",fontSize:"18px" }}>通过系统报名培训的学员列表</span>
					 {/* <Button
						style={{backgroundColor:"#2196f3", color:"#FFF",margin: 10, float: "right",marginRight:"2rem",minWidth:"50px" }}
						onClick={(e) => {
							this.state.resitStudent=[];
							//this.state.resitStudent.push(resit_student.id)
							var checklist = document.getElementsByName("resitselected");
							var m=0;
							for(var i = 0; i < checklist.length; i++) {

								if(checklist[i].checked==true){
									m++
								}
							}
						   if(m==0){
							this.popUpNotice(NOTICE, 0, "请选择学员");
							return false
						   }
						   // console.log(this.state.selected.id);
							this.popUpNotice(ALERT, 0, "报名已选择学员参加补考", [
								() => {
									
								  //  console.log(this.state.clazzStudents)
								  //  this.state.selected = clazz;
								  this.state.resitStudent=[];
								  for(var i=0;i<checklist.length;i++){
									if(checklist[i].checked==true)
										this.state.resitStudent.push(checklist[i].value)
									}   
								  this.resit_student(this.state.resitStudent);
									this.closeNotice();
								}, () => {
									this.closeNotice();
								}]);                              
							
						}}>
						{"报名"}
					</Button>      */}
					 <div style={{marginTop:"3rem"}}>
					 <p className="nyx-resit-name" style={{width:"80px",marginLeft:"3rem"}}>姓名</p>
					 <p className="nyx-resit-name" style={{width:"150px"}}>科目</p>
					 <span className="nyx-resit-name" style={{width:"150px"}}>地区</span>
					 {sessionStorage.classify==1?this.state.arrangedStudents.map(resit_student => {

						switch (resit_student.is_inlist) {
						case "3":
						return (
						<div key={resit_student.id}>
						{/* <input 
						style={{margin:"1rem 0.5rem 0 2rem",height:"16px"}}
						name={"resitselected"}
						value={resit_student.id}
						type="checkbox"/>  */}
						<div
							title={resit_student.name}
							className="nyx-clazz-student-message"
							style={{width:"80px",margin:"1rem 0.5rem 0 2rem"}}
						>{resit_student.name}</div>
						<div
							title={getCourse(resit_student.course_id)}
							className="nyx-clazz-student-message"
							style={{width:"150px"}}
						>{getCourse(resit_student.course_id)}</div>
						<div
							title={getCity(resit_student.area_id)}
							className="nyx-clazz-student-message"
							style={{width:"150px"}}
						>{getCity(resit_student.area_id)}</div>
						<Button
							color="primary"
							raised 
							onClick={() => {
								this.popUpNotice(ALERT, 0, resit_student.name+"报名参加补考", [
									() => {
										this.state.resitStudent=[];
										this.state.resitStudent.push(resit_student.id)
										this.resit_student(this.state.resitStudent);
										this.closeNotice();
									}, () => {
										this.closeNotice();
									}]);  
							
							}}
							className="nyx-org-btn-sm"                                            
							style={{ position:"relative",top:"7px",minHeight:"26px",float:"right",right:"2rem"}}
						>
							{"报名"}
						</Button>

						</div>
						)
						}
						}):this.state.arrangedStudents_comp.map(resit_student => {
                      console.log(resit_student)
							switch (resit_student.is_inlist) {
							case "3":
							return (
							<div key={resit_student.id}>
							{/* <input 
							style={{margin:"1rem 0.5rem 0 2rem",height:"16px"}}
							name={"resitselected"}
							value={resit_student.id}
							type="checkbox"/>  */}
							<div
								title={resit_student.name}
								className="nyx-clazz-student-message"
								style={{width:"80px",margin:"1rem 0.5rem 0 2rem"}}
							>{resit_student.name}</div>
							<div
								title={getCourse(resit_student.course_id)}
								className="nyx-clazz-student-message"
								style={{width:"150px"}}
							>{getCourse(resit_student.course_id)}</div>
							<div
								title={getCity(resit_student.area_id)}
								className="nyx-clazz-student-message"
								style={{width:"150px"}}
							>{getCity(resit_student.area_id)}</div>
							<Button
								color="primary"
								raised 
								onClick={() => {
									this.popUpNotice(ALERT, 0, resit_student.name+"报名参加补考", [
										() => {
											this.state.resitStudent=[];
											this.state.resitStudent.push(resit_student.id)
											this.resit_student(this.state.resitStudent);
											this.closeNotice();
										}, () => {
											this.closeNotice();
										}]);  
								
								}}
								className="nyx-org-btn-sm"                                            
								style={{ position:"relative",top:"7px",minHeight:"26px",float:"right",right:"2rem"}}
							>
								{"报名"}
							</Button>
	
							</div>
							)
							}
							})}
					 </div>
					 {sessionStorage.classify==1?<div>
						<span  style={{  display:this.state.unline.length==0?"none":"block",color:"#2196F3",marginLeft:"2rem",top:"3rem",position:"relative",fontSize:"18px" }}>未通过系统报名培训的学员列表</span>
					 <div style={{display:this.state.unline.length==0?"none":"block",marginTop:"5rem"}}>
					 <p className="nyx-resit-name" style={{width:"80px",marginLeft:"3rem"}}>姓名</p>
					 <p className="nyx-resit-name" style={{width:"150px"}}>科目</p>
					 <span className="nyx-resit-name" style={{width:"150px"}}>地区</span>
					 {this.state.unline.map(online_student => {

						
						return (
						<div key={online_student.id}>
						{/* <input 
						style={{margin:"1rem 0.5rem 0 2rem",height:"16px"}}
						name={"resitselected"}
						value={resit_student.id}
						type="checkbox"/>  */}
						<div
							title={online_student.name}
							className="nyx-clazz-student-message"
							style={{width:"80px",margin:"1rem 0.5rem 0 2rem"}}
						>{online_student.name}</div>
						<div
							title={getCourse(online_student.course_id)}
							className="nyx-clazz-student-message"
							style={{width:"150px"}}
						>{getCourse(online_student.course_id)}</div>
						<div
							title={getCity(online_student.area_id)}
							className="nyx-clazz-student-message"
							style={{width:"150px"}}
						>{getCity(online_student.area_id)}</div>
						<Button
							color="primary"
							raised 
							onClick={() => {
								var info_completed=getCache("info_completed");
								var info_completed_per=info_completed/20;
								console.log(info_completed_per);
								if(info_completed_per<1){
								this.popUpNotice("alert", 0, '企业相关信息完成'+info_completed_per*100+'%, 请先补全企业相关信息');
								return
								}
								this.gain_online_infos(online_student.id);
								

								// this.popUpNotice(ALERT, 0, resit_student.name+"报名参加补考", [
								// 	() => {
								// 		this.state.resitStudent=[];
								// 		this.state.resitStudent.push(resit_student.id)
								// 		this.resit_student(this.state.resitStudent);
								// 		this.closeNotice();
								// 	}, () => {
								// 		this.closeNotice();
								// 	}]);  
							
							}}
							className="nyx-org-btn-lg"                                            
							style={{ position:"relative",top:"7px",minHeight:"26px",float:"right",right:"2rem"}}
						>
							{"补全信息并报名"}
						</Button>

						</div>
						)
						
						})}
					 </div>
					 </div>:""}
					
					</div>
					</Drawer>

			{this.newStudentDialog()}
			{/* {this.resit_check()} */}
			<CommonAlert
			show={this.state.alertOpen}
			type={this.state.alertType}
			code={this.state.alertCode}
			content={this.state.alertContent}
			action={this.state.alertAction}>
			</CommonAlert>
			</div>
					)
				}
			}

export default Resit;