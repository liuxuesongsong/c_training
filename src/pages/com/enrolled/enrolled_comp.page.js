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
	RECALL_CANCEL,RESIT_REG,RECALL_RESIT,RESIT_CLASSINFO,AUTHENTICATE_ID_CARD
} from '../../../enum';
import Lang from '../../../language';
import Code from '../../../code';

import CommonAlert from '../../../components/CommonAlert';

const Style = {
	paper: { margin: 10, width: 400, float: "left" }
}

class Enrolled_Comp extends Component {
	state = {
		course: "0",
		course_id: "",
		a_id: "",
		c_area_id: "",
		is_register: "",
		cancel_reason: "",
		must_cancel_reason: "",
		cancel_student_name: "",
		cancel_student_id: "",
		cancel_show_student_id:"",
		cancel_show_student_name:"",
		fkenrolled_height: 1,
		unarranged_height: 1,
		arranged_height: 1,
		unenrolled_height: 1,
		resit_height:1,
		resits:[],
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
		graduation_time:"",
		education:"",
		time_istrue:0,
		graduation_time:"",
		time_label:"毕业时间",
		notice_msg:"运维项目经理-博士毕业不少于1年",
		notice_train_time:0,
		SignUpStudent:[],
		openSignUpDialog:false,
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
		openCancelReason: false,
		openCancel:false
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
		window.currentPage.state.areas = getCache("areas");
		window.currentPage.state.students = students === undefined ? [] : students;
		window.currentPage.state.cancel_students = cancel_students === undefined ? [] : cancel_students;
		window.currentPage.state.resits = resits === undefined ? [] : resits;
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
	getAreas_co = () => {
	    var components = []
	  var markers = [];
	  markers[13]="安徽省";
	   markers[1]="北京市";
	   markers[14]="福建省";
	   markers[20]="广东省(无深圳)";
	   markers[18]="湖北省";
	   markers[11]="江苏省";
	   markers[8]="辽宁省";
	   markers[16]="山东省";
	   markers[27]="陕西省";
	   markers[3]="上海市";
	   markers[36]="深圳市";
	   markers[23]="四川省";
	   markers[25]="云南省";
	   markers[12]="浙江省";
	   for(var key in markers){
            components.push(
			<option value={key}>{ markers[key]}</option>	
			)
		};
       return components
	}
	authenticate_id_card=()=>{
		var cb = (route, message, arg) => {
			if (message.code === Code.LOGIC_SUCCESS) {

			}
			this.popUpNotice(NOTICE, 0, message.msg);
		}
		getData(getRouter(AUTHENTICATE_ID_CARD), { session: sessionStorage.session,identity_card:document.getElementById("new_identity_card").value }, cb, { });
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
	cancelResitStudent = (id) => {
		var cb = (route, message, arg) => {
			if (message.code === Code.LOGIC_SUCCESS) {
				this.fresh();
			}
			this.popUpNotice(NOTICE, 0, message.msg);
		}
		console.log(id)
		getData(getRouter(RECALL_RESIT), { session: sessionStorage.session, resit_id: id }, cb, { });
	}
   //运维修改
	updateStudents = () => {
		
		//console.log(this.state.cancel_students)
		let fkStudents = [], newStudents = [], unarragedStudents = [], arrangedStudents = [],unarrageResits = [],arrageResits = [], newStudents_comp = [], unarragedStudents_comp = [], arrangedStudents_comp = [],unarrageResits_comp = [],arrageResits_comp = [];;
		for (var i = 0; i < this.state.students.length; i++) {
			if (this.state.students[i].is_inlist == STATUS_FK_UNDO) {
				fkStudents.push(this.state.students[i]);
			}
			if (this.state.students[i].is_inlist == STATUS_ENROLLED_UNDO) {
				if(this.state.students[i].course_id==1||this.state.students[i].course_id==2){
					newStudents.push(this.state.students[i]);
				}
				if(this.state.students[i].course_id==3||this.state.students[i].course_id==4){
					newStudents_comp.push(this.state.students[i]);
				}
				
			}
			if (this.state.students[i].is_inlist == STATUS_ENROLLED_DID||this.state.students[i].is_inlist == STATUS_ARRANGED_DID) {
				if(this.state.students[i].course_id==1||this.state.students[i].course_id==2){
					unarragedStudents.push(this.state.students[i]);
				}
				if(this.state.students[i].course_id==3||this.state.students[i].course_id==4){
					unarragedStudents_comp.push(this.state.students[i]);
				}
				
				//unarragedStudents.push(this.state.students[i]);
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
			if(this.state.cancel_students[i].course_id==1||this.state.cancel_students[i].course_id==2){
				unarragedStudents.push(this.state.cancel_students[i]);
			}
			if(this.state.cancel_students[i].course_id==3||this.state.cancel_students[i].course_id==4){
				unarragedStudents_comp.push(this.state.cancel_students[i]);
			}
			//unarragedStudents.push(this.state.cancel_students[i]);
		}
		for(var i = 0; i < this.state.resits.length; i++) {
			if (this.state.resits[i].state == 1) {
				if(this.state.resits[i].course_id==1||this.state.resits[i].course_id==2){
					unarrageResits.push(this.state.resits[i]);
				}
				if(this.state.resits[i].course_id==3||this.state.resits[i].course_id==4){
					unarrageResits_comp.push(this.state.resits[i]);
				}
				//unarrageResits.push(this.state.resits[i]);
			}
			if (this.state.resits[i].state == 2) {
				if(this.state.resits[i].course_id==1||this.state.resits[i].course_id==2){
					arrageResits.push(this.state.resits[i]);
				}
				if(this.state.resits[i].course_id==3||this.state.resits[i].course_id==4){
					arrageResits_comp.push(this.state.resits[i]);
				}
			//	arrageResits.push(this.state.resits[i]);
			}
		}
		this.setState({
			fkStudents: fkStudents,
			newStudents: newStudents,
			unarragedStudents: unarragedStudents,
			arrangedStudents: arrangedStudents,
			unarrageResits:unarrageResits,
			arrageResits:arrageResits,
			newStudents_comp: newStudents_comp,
			unarragedStudents_comp: unarragedStudents_comp,
			arrangedStudents_comp: arrangedStudents_comp,
			unarrageResits_comp:unarrageResits_comp,
			arrageResits_comp:arrageResits_comp
		})
	}
	 //运维修改
	//  updateStudents = () => {
	// 	console.log(this.state.cancel_students)
	// 	let fkStudents = [], newStudents = [], unarragedStudents = [], arrangedStudents = [],unarrageResits = [],arrageResits = [];
	// 	for (var i = 0; i < this.state.students.length; i++) {
	// 		if (this.state.students[i].is_inlist == STATUS_FK_UNDO) {
	// 			fkStudents.push(this.state.students[i]);
	// 		}
	// 		if (this.state.students[i].is_inlist == STATUS_ENROLLED_UNDO) {
	// 			newStudents.push(this.state.students[i]);
	// 		}
	// 		if (this.state.students[i].is_inlist == STATUS_ENROLLED_DID||this.state.students[i].is_inlist == STATUS_ARRANGED_DID) {
	// 			unarragedStudents.push(this.state.students[i]);
	// 		}
	// 		if (this.state.students[i].is_inlist == 3) {
	// 			arrangedStudents.push(this.state.students[i]);
	// 		}		
	// 	}
	// 	for(var i = 0; i < this.state.cancel_students.length; i++) {
	// 		unarragedStudents.push(this.state.cancel_students[i]);
	// 	}
	// 	for(var i = 0; i < this.state.resits.length; i++) {
	// 		if (this.state.resits[i].state == 1) {
	// 			unarrageResits.push(this.state.resits[i]);
	// 		}
	// 		if (this.state.resits[i].state == 2) {
	// 			arrageResits.push(this.state.resits[i]);
	// 		}
	// 	}
	// 	this.setState({
	// 		fkStudents: fkStudents,
	// 		newStudents: newStudents,
	// 		unarragedStudents: unarragedStudents,
	// 		arrangedStudents: arrangedStudents,
	// 		unarrageResits:unarrageResits,
	// 		arrageResits:arrageResits
	// 	})
	// }
	cancelEnroll(id) {
		var cb = (route, message, arg) => {
			if (message.code === Code.LOGIC_SUCCESS) {
				this.fresh();
			}
			this.handleRequestClose()
			this.popUpNotice(NOTICE, 0, message.msg);
		}
		
		getData(getRouter(UNROLL_STUDENT), { session: sessionStorage.session, id: id }, cb, { id: id });
	}
	send_cancel() {
		var cb = (route, message, arg) => {
			if (message.code === Code.LOGIC_SUCCESS) {
				this.fresh();
			}
			this.handleRequestClose()
			this.popUpNotice(NOTICE, 0, message.msg);
		}
		getData(getRouter(APPLY_CANCEL), {
			session: sessionStorage.session,
			user_id: this.state.cancel_student_id,
			reason: this.state.cancel_reason
		}, cb, {});
	}
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

	// 将新加入的学生排队
	erollStudent(id) {
		var cb = (router, message, arg) => {
			if (message.code === Code.LOGIC_SUCCESS) {
				let student = getStudent(arg.id);
				student.is_inlist = STATUS_ENROLLED_DID;
				this.updateStudents();
				this.popUpNotice(NOTICE, 0, message.msg);
				this.fresh();
			}
			this.popUpNotice(NOTICE, 0, message.msg);
		}
		var reason = document.getElementById("selected_train_time").value;
		getData(getRouter(ENROLL_STUDENT), { session: sessionStorage.session, id: id,reason:reason }, cb, { id: id });
	}

	newStudent(student) {
		var cb = (route, message, arg) => {
			if (message.code === Code.LOGIC_SUCCESS) {
				window.CacheData.students.push(Object.assign(arg.student, { id: message.id }));
				this.fresh();
			}
			this.handleRequestClose()
			this.popUpNotice(NOTICE, 0, message.msg);
		}
		getData(getRouter(INSERT_STUDENT), { session: sessionStorage.session, student: student }, cb, { student: student });
	}

	newStudentList() {
		var components = [];
		var newStudentInput = Lang[window.Lang].pages.com.students.input;
		for (var p in newStudentInput) {
			components.push(<TextField
			className="nyx-form-div"
			key={p}
			id={"new_" + p}
			label={newStudentInput[p]}
			/>)
		}
		return components
	}

	newStudentCity() {
		var components = [];
		var newStudentAreas = window.CacheData.areas;
		for (var p in newStudentAreas) {
			components.push(
				<option value={p} key={p}>{newStudentAreas[p]}</option>
			)
		}
		return components
	}

	newStudentInst() {
		var components = [];
		var newStudentInsts = window.CacheData.insts;
		for (var p in newStudentInsts) {
			components.push(

				<option value={p} key={p}>{newStudentInsts[p]}</option>
			)
		}
		return components
	}

	removeStudent(id) {
		var cb = (route, message, arg) => {
			if (message.code === Code.LOGIC_SUCCESS) {
				for (var i = 0; i < window.CacheData.students.length; i++) {
					if (window.CacheData.students[i].id === arg.id) {
						window.CacheData.students.splice(i, 1);
						break;
					}
				}
				this.fresh();
			}
			this.popUpNotice(NOTICE, 0, message.msg);
		}
		getData(getRouter(REMOVE_STUDENT), { session: sessionStorage.session, id: id }, cb, { id: id });
	}
	change_notice_msg = (course_id,edu)=>{
		if(document.getElementById("new_graduation_time").value==""){
			console.log("zheli")
			if(course_id==="3"){
			
				if(edu==="博士"){
				  this.setState({
					  notice_msg:"运维项目经理-博士毕业不少于1年",
					  time_label:"毕业时间",
					  time_istrue:0
				  })
				}else if(edu==="硕士"){
					this.setState({
						notice_msg:"运维项目经理-硕士毕业不少于2年",
						time_label:"毕业时间",
						time_istrue:0
					})
				  }else if(edu==="本科"){
					this.setState({
						notice_msg:"运维项目经理-本科毕业不少于3年",
						time_label:"毕业时间",
						time_istrue:0
					})
				  }else if(edu==="大专"){
					this.setState({
						notice_msg:"运维项目经理-大专毕业不少于4年",
						time_label:"毕业时间",
						time_istrue:0
					})
				  }else if(edu==="大专以下"){
					this.setState({
						notice_msg:"运维项目经理-大专以下毕业不少于10年",
						time_label:"毕业时间",
						time_istrue:0
					})
				  }
				
			}else if(course_id==="4"){
				if(edu==="博士"){
				  this.setState({
					  notice_msg:"运维高级项目经理-博士毕业不少于2年",
					  time_label:"毕业时间",
					  time_istrue:0
				  })
				}else if(edu==="硕士"){
					this.setState({
						notice_msg:"运维高级项目经理-硕士毕业不少于3年",
						time_label:"毕业时间",
						time_istrue:0
					})
				  }else if(edu==="本科"){
					this.setState({
						notice_msg:"运维高级项目经理-本科毕业不少于5年",
						time_label:"毕业时间",
						time_istrue:0
					})
				  }else{
					this.setState({
						notice_msg:"完成运维项目经理登记的时间不少于3年",
						time_label:"运维项目经理登记时间",
						time_istrue:0
					})
				  }
				  
				
			}
		}else{
			this.change_times(document.getElementById("new_graduation_time").value)
		}
	   }
	   change_select_notice_msg = (course_id,edu)=>{
		if(document.getElementById("change_graduation_time").value==""){
			if(course_id==="3"){
			
				if(edu==="博士"){
				  this.setState({
					  notice_msg:"运维项目经理-博士毕业不少于1年",
					  time_label:"毕业时间",
					  time_istrue:0
				  })
				}else if(edu==="硕士"){
					this.setState({
						notice_msg:"运维项目经理-硕士毕业不少于2年",
						time_label:"毕业时间",
						time_istrue:0
					})
				  }else if(edu==="本科"){
					this.setState({
						notice_msg:"运维项目经理-本科毕业不少于3年",
						time_label:"毕业时间",
						time_istrue:0
					})
				  }else if(edu==="大专"){
					this.setState({
						notice_msg:"运维项目经理-大专毕业不少于4年",
						time_label:"毕业时间",
						time_istrue:0
					})
				  }else if(edu==="大专以下"){
					this.setState({
						notice_msg:"运维项目经理-大专以下毕业不少于10年",
						time_label:"毕业时间",
						time_istrue:0
					})
				  }
				
			}else if(course_id==="4"){
				if(edu==="博士"){
				  this.setState({
					  notice_msg:"运维高级项目经理-博士毕业不少于2年",
					  time_label:"毕业时间",
					  time_istrue:0
				  })
				}else if(edu==="硕士"){
					this.setState({
						notice_msg:"运维高级项目经理-硕士毕业不少于3年",
						time_label:"毕业时间",
						time_istrue:0
					})
				  }else if(edu==="本科"){
					this.setState({
						notice_msg:"运维高级项目经理-本科毕业不少于5年",
						time_label:"毕业时间",
						time_istrue:0
					})
				  }else{
					this.setState({
						notice_msg:"完成运维项目经理登记的时间不少于3年",
						time_label:"运维项目经理登记时间",
						time_istrue:0
					})
				  }
				  
				
			}
		}else{
			this.change_select_times(document.getElementById("change_graduation_time").value)
		}
	   }
	   change_times = (event) =>{
			var date = new Date(event);
			console.log(date)
			var graduation_time_stamp = date.getTime();
			var myDate = new Date();
			var graduation_long_time = myDate.getTime() - graduation_time_stamp;
			var days_time =Math.floor(graduation_long_time/86400000);
			var education = document.getElementById("new_education").value;
	
			if(document.getElementById("new_course_id").value==="3"){
			if(education==="博士"){
			if(days_time<365){
			this.setState({
				notice_msg:"不满足报名条件",
				time_label:"毕业时间",
				time_istrue:-1
			})
			}else{
				this.setState({
					notice_msg:"运维项目经理-博士毕业不少于1年",
					time_label:"毕业时间",
					time_istrue:0
				})
				
			}
	
			}else if(education==="硕士"){
			if(days_time<730){
			this.setState({
				notice_msg:"不满足报名条件",
				time_label:"毕业时间",
				time_istrue:-1
			})
			}else{
				this.setState({
					notice_msg:"运维项目经理-硕士毕业不少于2年",
					time_label:"毕业时间",
					time_istrue:0
				})
				
			}
			}
			else if(education==="本科"){
			if(days_time<1095){
			this.setState({
				notice_msg:"不满足报名条件",
				time_label:"毕业时间",
				time_istrue:-1
			})
			}else{
				this.setState({
					notice_msg:"运维项目经理-本科毕业不少于3年",
					time_label:"毕业时间",
					time_istrue:0
				})
				
			}
			}else if(education==="大专"){
			if(days_time<1460){
			this.setState({
				notice_msg:"不满足报名条件",
				time_label:"毕业时间",
				time_istrue:-1
			})
			}else{
				this.setState({
					notice_msg:"运维项目经理-大专毕业不少于4年",
					time_label:"毕业时间",
					time_istrue:0
				})
				
			}
			}else if(education==="大专以下"){
			if(days_time<3650){
			this.setState({
				notice_msg:"不满足报名条件",
				time_label:"毕业时间",
				time_istrue:-1
			})
			}else{
				this.setState({
					notice_msg:"运维项目经理-大专以下毕业不少于10年",
					time_label:"毕业时间",
					time_istrue:0
				})
				
			}
			}
			}else if(document.getElementById("new_course_id").value==="4"){
			if(education==="博士"){
			if(days_time<730){
			this.setState({
				notice_msg:"不满足报名条件",
				time_label:"毕业时间",
				time_istrue:-1
			})
			}else{
				this.setState({
					notice_msg:"运维高级项目经理-博士毕业不少于2年",
					time_label:"毕业时间",
					time_istrue:0
				})
			}
			}else if(education==="硕士"){
			if(days_time<1095){
			this.setState({
			notice_msg:"不满足报名条件",
			time_label:"毕业时间",
			time_istrue:-1
			})
			}else{
				this.setState({
					notice_msg:"运维高级项目经理-硕士毕业不少于3年",
					time_label:"毕业时间",
					time_istrue:0
				})
			}
			}
			else if(education==="本科"){
			if(days_time<1825){
			this.setState({
			notice_msg:"不满足报名条件",
			time_label:"毕业时间",
			time_istrue:-1
			})
			}else{
				this.setState({
					notice_msg:"运维高级项目经理-本科毕业不少于5年",
					time_label:"毕业时间",
					time_istrue:0
				})
			}
			}else if(education==="大专"){
			if(days_time<1095){
			this.setState({
			notice_msg:"不满足报名条件",
			time_label:"运维项目经理登记时间",
			time_istrue:-1
			})
			}else{
				this.setState({
					notice_msg:"完成运维项目经理登记的时间不少于3年",
					time_label:"运维项目经理登记时间",
					time_istrue:0
				})
			}
			}else if(education==="大专以下"){
			if(days_time<1095){
			this.setState({
			notice_msg:"不满足报名条件",
			time_label:"运维项目经理登记时间",
			time_istrue:-1
			})
			}else{
				this.setState({
					notice_msg:"完成运维项目经理登记的时间不少于3年",
					time_label:"运维项目经理登记时间",
					time_istrue:0
				})
			}
			}
			}
	   }
	   change_course_id = (e) =>{
		   
		var course_id = e.target.value;
		console.log(course_id)
		var edu = document.getElementById("new_education").value;
		this.change_notice_msg(course_id,edu)
	   }
	   change_edu = (e) =>{
		  var course_id = document.getElementById("new_course_id").value;
		  
		  var edu = e.target.value;
		  this.change_notice_msg(course_id,edu)
	   }
	   change_select_times = (event) =>{
		var date = new Date(event);
		console.log(date)
		var graduation_time_stamp = date.getTime();
		var myDate = new Date();
		var graduation_long_time = myDate.getTime() - graduation_time_stamp;
		var days_time =Math.floor(graduation_long_time/86400000);
		var education = document.getElementById("change_education").value;
	
		if(document.getElementById("student_course_id").value==="3"){
		if(education==="博士"){
		if(days_time<365){
		this.setState({
			notice_msg:"不满足报名条件",
			time_label:"毕业时间",
			time_istrue:-1
		})
		}else{
			this.setState({
				notice_msg:"运维项目经理-博士毕业不少于1年",
				time_label:"毕业时间",
				time_istrue:0
			})
			
		}
	
		}else if(education==="硕士"){
		if(days_time<730){
		this.setState({
			notice_msg:"不满足报名条件",
			time_label:"毕业时间",
			time_istrue:-1
		})
		}else{
			this.setState({
				notice_msg:"运维项目经理-硕士毕业不少于2年",
				time_label:"毕业时间",
				time_istrue:0
			})
			
		}
		}
		else if(education==="本科"){
		if(days_time<1095){
		this.setState({
			notice_msg:"不满足报名条件",
			time_label:"毕业时间",
			time_istrue:-1
		})
		}else{
			this.setState({
				notice_msg:"运维项目经理-本科毕业不少于3年",
				time_label:"毕业时间",
				time_istrue:0
			})
			
		}
		}else if(education==="大专"){
		if(days_time<1460){
		this.setState({
			notice_msg:"不满足报名条件",
			time_label:"毕业时间",
			time_istrue:-1
		})
		}else{
			this.setState({
				notice_msg:"运维项目经理-大专毕业不少于4年",
				time_label:"毕业时间",
				time_istrue:0
			})
			
		}
		}else if(education==="大专以下"){
		if(days_time<3650){
		this.setState({
			notice_msg:"不满足报名条件",
			time_label:"毕业时间",
			time_istrue:-1
		})
		}else{
			this.setState({
				notice_msg:"运维项目经理-大专以下毕业不少于10年",
				time_label:"毕业时间",
				time_istrue:0
			})
			
		}
		}
		}else if(document.getElementById("student_course_id").value==="4"){
		if(education==="博士"){
		if(days_time<730){
		this.setState({
			notice_msg:"不满足报名条件",
			time_label:"毕业时间",
			time_istrue:-1
		})
		}else{
			this.setState({
				notice_msg:"运维高级项目经理-博士毕业不少于2年",
				time_label:"毕业时间",
				time_istrue:0
			})
		}
		}else if(education==="硕士"){
		if(days_time<1095){
		this.setState({
		notice_msg:"不满足报名条件",
		time_label:"毕业时间",
		time_istrue:-1
		})
		}else{
			this.setState({
				notice_msg:"运维高级项目经理-硕士毕业不少于3年",
				time_label:"毕业时间",
				time_istrue:0
			})
		}
		}
		else if(education==="本科"){
		if(days_time<1825){
		this.setState({
		notice_msg:"不满足报名条件",
		time_label:"毕业时间",
		time_istrue:-1
		})
		}else{
			this.setState({
				notice_msg:"运维高级项目经理-本科毕业不少于5年",
				time_label:"毕业时间",
				time_istrue:0
			})
		}
		}else if(education==="大专"){
		if(days_time<1095){
		this.setState({
		notice_msg:"不满足报名条件",
		time_label:"运维项目经理登记时间",
		time_istrue:-1
		})
		}else{
			this.setState({
				notice_msg:"完成运维项目经理登记的时间不少于3年",
				time_label:"运维项目经理登记时间",
				time_istrue:0
			})
		}
		}else if(education==="大专以下"){
		if(days_time<1095){
		this.setState({
		notice_msg:"不满足报名条件",
		time_label:"运维项目经理登记时间",
		time_istrue:-1
		})
		}else{
			this.setState({
				notice_msg:"完成运维项目经理登记的时间不少于3年",
				time_label:"运维项目经理登记时间",
				time_istrue:0
			})
		}
		}
		}
	}
	   change_select_course_id = (e) =>{
		   
		var course_id = e.target.value;
		var edu = document.getElementById("change_education").value;
		this.change_select_notice_msg(course_id,edu)
	   }
	   change_select_edu= (e) =>{
		   console.log("xiugai")
		  var course_id = document.getElementById("student_course_id").value;
		  
		  var edu = e.target.value;
		  this.change_select_notice_msg(course_id,edu)
	   }
	modifyStudent = () => {
		var cb = (route, message, arg) => {
			if (message.code === Code.LOGIC_SUCCESS) {
				this.setState({
					right: false,
				});
				arg.self.fresh();
			}
			this.popUpNotice(NOTICE, 0, message.msg);
		}
		var id = this.state.selected.id;
		if(document.getElementById("licence.code").value==""){
			this.popUpNotice(NOTICE, 0, "请输入身份证号码");
			return;
		}
		if (document.getElementById("change_graduation_time").value === "") {
			this.popUpNotice(NOTICE, 0, "您没有输入有效时间")
			return
			}
		var obj = {
			name: document.getElementById("student_name").value,
			identity_card: document.getElementById("licence.code").value,
			course_id:document.getElementById("student_course_id").value,
			area_id:document.getElementById("change_area_id").value,
			register: document.getElementById("register").value,
			department: document.getElementById("department").value,
			duty: document.getElementById("duty").value,
			mobile: document.getElementById("mobile").value,
			mail: document.getElementById("mail").value,
			wechat: document.getElementById("wechat").value,
			education:document.getElementById("change_education").value,
			graduation_time:document.getElementById("change_graduation_time").value
		//	detail: document.getElementById("detail").value,
		}
		getData(getRouter(UPDATE_STUDENT), { session: sessionStorage.session, id: this.state.selectedStudentId, student: obj }, cb, { self: window.currentPage, data: obj });
	}

	agreeArrange() {
		var id = this.state.selectedStudentId;
		var cb = (router, message, arg) => {
			if (message.code === Code.LOGIC_SUCCESS) {
				getStudent(arg.id).is_inlist = STATUS_ARRANGED_DID;
				this.fresh();
			}
			this.popUpNotice(NOTICE, 0, message.msg);
		}
		getData(getRouter(AGREE_ARRANGE), { session: sessionStorage.session, id: id }, cb, { id: id });
	}

	refuseArrange() {
		var id = this.state.selectedStudentId;
		var cb = (router, message, arg) => {
			if (message.code === Code.LOGIC_SUCCESS) {
				let student = getStudent(arg.id);
				student.status[STATUS_AGREED].status = STATUS_AGREED_REFUSED;
				student.status[STATUS_ARRANGED].status = STATUS_ARRANGED_UNDO;
				this.fresh();
			}
			this.popUpNotice(NOTICE, 0, message.msg);
		}
		getData(getRouter(REFUSE_ARRANGE), { session: sessionStorage.session, id: id }, cb, { id: id });
	}

	selectedStudent(student) {
		this.state.selectedStudentId = student.id;
		this.state.selected = student;
		this.state.course = student.course_id;
	}
	cancel_reason() {
		return(
			<Dialog open={this.state.openCancelReason} onRequestClose={this.handleRequestClose} >
			<div style={{padding:"0 24px"}}>
			<DialogTitle style={{padding:"24px 0"}}>
			系统正在排班，是否继续取消{this.state.cancel_student_name}报名？
			</DialogTitle>
			<p style={{margin:"0",fontSize:"14px",lineHeight:"1.5"}}>为了企业能更快的参加培训，使报名系统中人员更加准确，减少企业不必要的沟通成本，在【待安排列表中】已显示分配到培训机构时，培训机构即将会跟企业联系安排培训事宜，企业如再取消报名，<span style={{color:"red"}}>将会有90天锁定期</span>，如有特殊情况可以跟培训机构联系，进行退回。</p>
			<TextField
			style={{width:"100%",marginBottom:"2rem",marginTop:"0.5rem"}}
			className="nyx-clazz-message"
			key={"cancel_reason"}
			id={"cancel_reason"}
			label={"取消原因"}
			// value={this.state.selected["class_head"] === null ? "" : this.state.selected["class_head"]}
			onChange={(event) => {
			this.setState({
			cancel_reason:event.target.value 
			});
			}}
			>
			</TextField> 
			</div>
			<DialogActions>
		
			<div>
			<Button style={{backgroundColor:"#2196F3",color:"#FFF",marginRight:"1rem"}}
			onClick={() => {
			if (this.state.cancel_reason === "") {
			this.popUpNotice(NOTICE, 0, "请填写取消原因")
			return
			}
			if(this.state.cancel_reason.length>300){
			this.popUpNotice(NOTICE, 0, "请填写取消原因在300字以内")
			return
			}
			this.send_cancel()
			this.handleRequestClose()
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
				cancel_show() {
					return(
						<Dialog open={this.state.openCancel} onRequestClose={this.handleRequestClose} >
						<div style={{padding:"0 24px"}}>
						<DialogTitle style={{padding:"24px 0"}}>
						是否继续取消{this.state.cancel_show_student_name}报名？
						</DialogTitle>
						<p style={{margin:"0",fontSize:"14px",lineHeight:"1.5"}}>为了企业能更快的参加培训，使报名系统中人员更加准确，减少企业不必要的沟通成本，在【待安排列表中】未显示分配到培训机构时，企业可以取消报名，更改人员信息，再进行报名。</p>
						
						</div>
						<DialogActions>
					
						<div>
						<Button style={{backgroundColor:"#2196F3",color:"#FFF",marginRight:"1rem"}}
						onClick={() => {
							this.cancelEnroll(this.state.cancel_show_student_id)
						this.handleRequestClose()
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
				newStudentDialog() {
					return (
						<Dialog open={this.state.openNewStudentDialog} onRequestClose={this.handleRequestClose} >
			<DialogTitle>
			添加学员
			</DialogTitle>
			<DialogContent>
			<div style={{paddingTop:20}} className="nyx-form">
			<TextField
			className="nyx-form-div nyx-must-content"
			key={"name"}
			id={"new_name"}
			label={Lang[window.Lang].pages.com.students.input.name}
			/>
			<div className="nyx-form-div">
			<div style={{width:"50%",float:"left",marginTop:"1px"}} className="nyx-info-select-div">
			<p className="nyx-info-select-label">{Lang[window.Lang].pages.com.students.input.register}</p>
			<select
			style={{margin:0,fontSize:"16px",paddingBottom:"10px"}}
			className="nyx-info-select-lg"
			id="new_register_select"
			label={Lang[window.Lang].pages.org.clazz.info.area}
			onChange={(e)=>{
			this.setState({is_register:e.target.value})
			if(e.target.value==2){
			document.getElementById("new_register").value="培训考试报名"
			}else{
			document.getElementById("new_register").value=""
			}
			// console.log(e.target.value);
			}}
			>
			<option value={1}>{"临时登记编号"}</option>
			{/* <option value={2}>{"培训考试报名"}</option> */}
			<option value={3}>{"空"}</option>
			</select>
			</div>
			<TextField
			style={{width:"50%",marginLeft:"-3px",marginTop:"16px"}}
			key={"register"}
			id={"new_register"}
			disabled={this.state.is_register == 3||this.state.is_register == 2 ? true : false}
			/>

			</div>
			
			{/* <select
			className="nyx-info-select"
			id="new_area_id"
			label={Lang[window.Lang].pages.org.clazz.info.area}
			defaultValue={""}
			>
			{this.newStudentCity()}
			</select> */}
			{/* <TextField
			className="nyx-form-div"
			key={"area_id"}
			id={"new_area_id"}
			value={this.state.c_area_id}
			disabled
			label={Lang[window.Lang].pages.com.students.select.area_id}
			/> */}

			<div className="nyx-info-select-div">
			<p className="nyx-info-select-label">课程名称</p>
			{/* 运维修改 */}
			{sessionStorage.classify==2?
			<select
           // style={{borderBottom:"1px dashed"}}
			className="nyx-info-select-lg"
            id="new_course_id"
			//disabled={true}
			onChange={(e)=>{

				this.change_course_id(e)
				
			}}
			label={Lang[window.Lang].pages.org.clazz.info.area}
			>
			<option key={3} value={3}>运维项目经理</option>
			<option key={4} value={4}>运维高级项目经理</option>
			</select>:""
			}
			{/* 运维修改 */}
			{/* <select
			className="nyx-info-select-lg"
			id="new_course_id"
			label={Lang[window.Lang].pages.org.clazz.info.area}
			>
			 {getCourses().map(course => {
                return <option key={course.id} value={course.id}>{course.course_name}</option>
             })}
			
			</select> */}
			</div>
			<div className="nyx-info-select-div">
			<p className="nyx-info-select-label">培训城市</p>
			<select
			className="nyx-info-select-lg"
			id="new_area_id"
			value={this.state.c_area_id === null ? "" : this.state.c_area_id}
			onChange={(e) => {
			this.state.c_area_id = Number(e.target.value);
			this.setState({
			c_area_id: this.state.c_area_id
			});
			}}
			label={Lang[window.Lang].pages.org.clazz.info.area}
			>
			
			{this.getAreas_co()}
			 {/* {getAreas().map(area => {
                                    return <option key={area.id} value={area.id}>{area.area_name}</option>
                                })} */}
			</select>
			</div>
			<TextField
			className="nyx-form-div nyx-must-content"
			key={"mobile"}
			id={"new_mobile"}
			label={Lang[window.Lang].pages.com.students.input.mobile}
			defaultValue={""}
			/>
			<TextField
			className="nyx-form-div nyx-must-content"
			key={"mail"}
			id={"new_mail"}
			label={Lang[window.Lang].pages.com.students.input.mail}
			defaultValue={""}
			/>
			<div style={{float:"left"}} className="nyx-info-select-div">
			<p className="nyx-info-select-label">证件类型</p>
			<select
			className="nyx-info-select-lg"
			id="new_id_type"
			label={Lang[window.Lang].pages.org.clazz.info.area}
			>
			<option value={"身份证"}>{"身份证"}</option>
			<option value={"护照"}>{"护照"}</option>
			</select>
			</div>
			{/* <TextField
			className="nyx-form-div nyx-must-content"
			key={"id_type"}
			id={"new_id_type"}
			label={Lang[window.Lang].pages.com.students.input.id_type}
			defaultValue={""}
			/> */}
			<TextField
			className="nyx-form-div nyx-must-content"
			key={"identity_card"}
			id={"new_identity_card"}
			label={Lang[window.Lang].pages.com.students.input.identity_card}
			/>
			<span
			onClick={() => {
				if(document.getElementById("new_identity_card").value==""){
					this.popUpNotice(NOTICE, 0, "请输入身份证号码")
					return false
				}
				
				
				this.authenticate_id_card()
			}}
			style={{position:"absolute",marginTop:"2rem",right:"38px",fontSize:"10px",color:"#2196f3",cursor:"pointer"}}>身份证效验</span>
			<div style={{float:"left"}} className="nyx-info-select-div">
			<p className="nyx-info-select-label">运维项目经理情况</p>
			<select
			className="nyx-info-select-lg"
			id="new_id_type"
			onChange={(e)=>{
               if(e.target.value==2){
				this.popUpNotice(ALERT, 0, "未登记运维项目经理/运维高级项目经理人员需要先报名参加运维项目经理培训", [
					() => {
					this.closeNotice();
					}, () => {
					this.closeNotice();
					}]);
			   }
			}}
			label={Lang[window.Lang].pages.org.clazz.info.area}
			>
			<option value={"1"}>{"已登记运维项目经理/运维高级项目经理"}</option>
			<option value={"2"}>{"未登记"}</option>
			</select>
			</div>
			<TextField
			className="nyx-form-div"
			key={"department"}
			id={"new_department"}
			label={Lang[window.Lang].pages.com.students.input.department}
			/>
			<TextField
			className="nyx-form-div"
			key={"duty"}
			id={"new_duty"}
			label={Lang[window.Lang].pages.com.students.input.duty}
			/>
			<TextField
			className="nyx-form-div"
			key={"wechat"}
			id={"new_wechat"}
			label={Lang[window.Lang].pages.com.students.input.wechat}
			/>
			<div style={{float:"left"}} className="nyx-info-select-div">
				<p className="nyx-info-select-label">学历</p>
				<select
					onChange = {(e)=>{
						this.change_edu(e)
					}}
					className="nyx-info-select-lg"
					id="new_education"
					>
				<option value={"博士"}>{"博士"}</option>
				<option value={"硕士"}>{"硕士"}</option>
				<option value={"本科"}>{"本科"}</option>
				<option value={"大专"}>{"大专"}</option>
				<option value={"大专以下"}>{"大专以下"}</option>
			</select>
			</div>
			<div
              style={{top:"1.2rem"}}
			   className="nyx-input-date nyx-form-div nyx-clazz-message"
			   >
			   <span 
			    style={{top:"-16px"}}
			   >{this.state.time_label}</span>
				<input
			   // id="train_starttime"
				 style={{width:"98%"}}
				  type="date"
				  id="new_graduation_time"
				  //defaultValue={this.state.selected_start_year+"-"+this.state.selected_start_month+"-"+this.state.selected_start_date}
				  onChange={(event) => {
					this.change_times(document.getElementById("new_graduation_time").value);
				  }}/>
				  <span  style={this.state.time_istrue==0?{position:"relative",top:0,color:"#2196F3"}:{position:"relative",top:0,color:"red"}}>{this.state.notice_msg}</span>
			   </div>   
			{/* <div className="nyx-remark">
			<h4>备注栏:</h4>
			<p>1.临时登记人员填写临时登记证书编号(网站可查);</p>
			<p>2.原来在项目管理人员登记系统已报名培训考试填写培训考试报名;</p>
			<p>3.不是上述两种情况,备注栏目为空,不用填写。</p>
			</div> */}
			</div>
			</DialogContent>
			<DialogActions>
			<div>
			<Button style={{backgroundColor:"#2196F3",color:"#FFF",marginRight:"1rem"}}
			onClick={() => {
				
			var new_info_array={new_name:"您没有输入姓名",new_mobile:"您没有输入手机",
			new_mail:"您没有输入邮箱",new_identity_card:"您没有输入证件编号",
			new_department:"您没有输入部门",new_duty:"您没有输入职务"
			}
			for(var key in new_info_array){
			if (document.getElementById(key).value === "") {
			this.popUpNotice(NOTICE, 0, new_info_array[key])
			return
			}
			}
			if (document.getElementById("new_graduation_time").value === "") {
				this.popUpNotice(NOTICE, 0, "您没有输入有效时间")
				return
				}
			this.newStudent({

			name: document.getElementById("new_name").value,
			department: document.getElementById("new_department").value,
			duty: document.getElementById("new_duty").value,
			mobile: document.getElementById("new_mobile").value,
			mail: document.getElementById("new_mail").value,
			wechat: document.getElementById("new_wechat").value,
			id_type: document.getElementById("new_id_type").value,
			identity_card: document.getElementById("new_identity_card").value,
			register: document.getElementById("new_register").value,
			area_id: document.getElementById("new_area_id").value,
			course_id: document.getElementById("new_course_id").value,
			education:document.getElementById("new_education").value,
			graduation_time:document.getElementById("new_graduation_time").value,
			
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
				SignUpDialog(student) {
					console.log(student.area_id)
					return (
						<Dialog open={this.state.openSignUpDialog} onRequestClose={this.handleRequestClose} >

			<div style={{padding:"2rem"}}>
				{/* <div>{student.name}</div> */}
				<div style={{textAlign:"center",color:"#2196F3",fontWeight:"800",paddingBottom:"2rem",fontSize:"20px"}}>
				为{student.name}报名{student.area_id?getCity(student.area_id):""}的{student.course_id?getCourse(student.course_id):""}培训班
				</div>
				<p style={{color:"#2196F3"}} >
			可参加培训时间
			</p>
			{/* 运维修改 */}
			
			<select
			className={this.state.selected.a_id == -1 ?"nyx-card-enrroll-select-lg-dashed":"nyx-card-enrroll-select-lg"}
			defaultValue={""}
			id={"selected_train_time"}
			onChange={(e)=>{
			
			}}
			//defaultValue={this.state.selected.course_id ? this.state.selected.course_id : ""}
			>  
			    <option value={"0"}>{"-选择-"}</option>
		        <option value={"1"}>{"1个月以内"}</option>
				<option value={"2"}>{"1-2个月"}</option>
				<option value={"3"}>{"2个月以后"}</option>
			</select>
            {/* <span style={this.state.notice_train_time==0?{color:"#2196f3"}:{color:"red"}}>请选择可参加培训时间</span> */}

				<div style = {{color:"#2196F3",marginTop:"1rem"}}>
               平台通知
               </div>
				<ul className="nyx-login-select_list_Dialog">
					<li><span style = {{color:"#2196F3"}}>01.</span>{Lang[window.Lang].pages.main.notice_one}
					<a style={{fontSize:"16px",color:"#2196F3"}} target="view_window" href="http://www.csi-s.org.cn/miitnew_webmap/miitnew_pmbzgf/2015/07/17/1778896c187945e08b3effb9fcd7bc76.html"> 查看原文</a></li>
					<li><span style = {{color:"#2196F3"}}>02.</span>{Lang[window.Lang].pages.main.notice_two}</li>
					<li><span style = {{color:"#2196F3"}}>03.</span>{Lang[window.Lang].pages.main.notice_three}</li>
					<li><span style = {{color:"#2196F3"}}>04.</span>{Lang[window.Lang].pages.main.notice_four}</li>
				</ul>

			</div>
		
			<DialogActions>
			<div>
			<Button style={{backgroundColor:"#2196F3",color:"#FFF",marginRight:"1rem"}}
			onClick={() => {
				if(document.getElementById("selected_train_time").value==="0"){
									this.popUpNotice(NOTICE, 0, "请选择可参加培训时间")
									console.log(this.state.notice_train_time)
									return;
								}
							this.erollStudent(student.id);
							this.handleRequestClose()
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
						openCancelReason: false,
						openSignUpDialog:false,
						openCancel:false
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
				{/* 运维修改 */}
				{sessionStorage.classify==1?<div>
					<div className={'nyx-tips nyx-display-none'}><p>{"【已临时登记的运维项目经理】" +
				"第一步：请在下表中点击【修改】补充完整人员信息。" +
				"第二步：点击【报名】进行培训报名"}</p>
				<p style={{marginLeft:"0.4rem"}}>{"特别提醒:在“报名”提交前必须填完“企业相关信息”。"}</p>
				</div>
				<Paper className={'nyx-paper nyx-enroller-paper'}>
				<List style={{ padding: 0 }}>
				<div style={{  color:"#2196F3", marginBottom: "1rem", position: "relative" }} className="nyx-head-name">
				{"已临时登记的报名人员信息及管理"} <i
													onClick={() => {
													if (this.state.fkenrolled_height == 0) {
													this.setState({ fkenrolled_height: 1 })
													} else {
													this.setState({ fkenrolled_height: 0 })
													}
													}}

												className="glyphicon glyphicon-menu-down nyx-flexible" aria-hidden="true"></i>

                </div>             
					<div className={this.state.fkenrolled_height ? "nyx-list-paper" : "nyx-list-paper-change"}>
					{this.state.fkStudents.map(student =>
					<StudentCard
					type={CARD_TYPE_FK}
					key={student.id}
					name={student.name === null ? "" : student.name.toString()}
					mobile={student.mobile === null ? "" : student.mobile.toString()}
					email={student.mail === null ? "" : student.mail.toString()}
					level={Number(student.course_id)}
					city={Number(student.area_id)}
					duty={student.duty === null ? "" : student.duty.toString()}
					department={student.department === null ? "" : student.department.toString()}
					institution={student.institution === null ? "" : Number(student.institution)}
					is_inlist={student.is_inlist}
					action={[() => {
					this.selectedStudent(student);
					this.toggleDrawer(true)()
					}, () => {
					var info_completed=getCache("info_completed");
					
					var info_completed_per=info_completed/20;
					console.log(info_completed_per);
					if(info_completed_per<1){
					this.popUpNotice("alert", 0, '企业相关信息完成'+info_completed_per*100+'%, 请先补全企业相关信息');
					return
					}
					if(student.duty===""||student.department===""||student.mobile===""||student.mail===""){
					this.popUpNotice("alert", 0, '请先补全报名人员信息');
					return
					}
					this.setState({
						SignUpStudent:student,
						openSignUpDialog: true,
					})
					this.state.selectedStudentId = student.id;

					// this.popUpNotice(ALERT, 0, "为" + student.name + "报名"+ getCity(student.area_id) + "的"+getCourse(student.course_id)+ "培训班", [
					// () => {
					// this.erollStudent(student.id);
					// this.closeNotice();
					// }, () => {
					// this.closeNotice();
					// }]);
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
					</div>
			</List>
			</Paper>
			<div className={'nyx-tips nyx-display-none'}>
			{"【未临时登记的运维项目经理】" +
			"第一步：请在下表中点击【添加】新增人员，输入完整信息。" +
			"第二步：点击【报名】进行报名"
			}
			<p style={{marginLeft:"0.4rem"}}>{"特别提醒:在“报名”提交前必须填完“企业相关信息”。"}</p>
			</div>
			{/* 运维修改 */}
				</div>:""}
			<Paper className={'nyx-paper nyx-enroller-paper'}>
			<List style={{ padding: 0 }}>
			<div style={{ color:"#2196F3", marginBottom: "1rem", position: "relative" }} className="nyx-head-name">
			{Lang[window.Lang].pages.com.enrolled.unenrolled} <i
			onClick={() => {
			if (this.state.unenrolled_height == 0) {
			this.setState({ unenrolled_height: 1 })
			} else {
			this.setState({ unenrolled_height: 0 })
			}
			}}

			className="glyphicon glyphicon-menu-down nyx-flexible" aria-hidden="true"></i>
			<Button style={{ position: "absolute", right: "28px", top: "0" }} fab color="primary" aria-label="add" className={'nyx-paper-header-btn'}
			onClick={() => {
			if (getCache("base").c_area_id === 0) {
			this.popUpNotice("alert", 0, "请先补全企业相关信息");
			return
			}else if(getCache("base").name === ""){
			this.popUpNotice("alert", 0, "请先补全企业相关信息");
			return
			}
			this.setState({
			openNewStudentDialog: true,
			course: "1",
			time_label:"毕业时间",
			notice_msg:"运维项目经理-博士毕业不少于1年"
			})
			}}
			>
			{"添加"}
			</Button>
			</div>
			<div className={this.state.unenrolled_height ? "nyx-list-paper" : "nyx-list-paper-change"}>
			{/* 运维修改 */}
			{sessionStorage.classify==1?this.state.newStudents.map(student =>
			
			//{/* 运维修改 */} {this.state.newStudents.map(student =>
			<StudentCard
			type={CARD_TYPE_ENROLL}
			key={student.id}
			name={student.name === null ? "" : student.name.toString()}
			mobile={student.mobile === null ? "" : student.mobile.toString()}
			email={student.mail === null ? "" : student.mail.toString()}
			level={Number(student.course_id)}
			city={Number(student.area_id)}
			duty={student.duty === null ? "" : student.duty.toString()}
			department={student.department === null ? "" : student.department.toString()}
			institution={student.institution === null ? "" : Number(student.institution)}
			is_inlist={student.is_inlist}
			action={[() => {
			this.selectedStudent(student);
			var edu = student.education;
			var course_id = student.course_id;
			if(course_id==="1"){
		
				if(edu==="博士"){
				  this.setState({
					  notice_msg:"运维项目经理-博士毕业不少于1年",
					  time_label:"毕业时间",
					  time_istrue:0
				  })
				}else if(edu==="硕士"){
					this.setState({
						notice_msg:"运维项目经理-硕士毕业不少于2年",
						time_label:"毕业时间",
						time_istrue:0
					})
				  }else if(edu==="本科"){
					this.setState({
						notice_msg:"运维项目经理-本科毕业不少于3年",
						time_label:"毕业时间",
						time_istrue:0
					})
				  }else if(edu==="大专"){
					this.setState({
						notice_msg:"运维项目经理-大专毕业不少于4年",
						time_label:"毕业时间",
						time_istrue:0
					})
				  }else if(edu==="大专以下"){
					this.setState({
						notice_msg:"运维项目经理-大专以下毕业不少于10年",
						time_label:"毕业时间",
						time_istrue:0
					})
				  }
				
			}else if(course_id==="2"){
				if(edu==="博士"){
				  this.setState({
					  notice_msg:"运维高级项目经理-博士毕业不少于2年",
					  time_label:"毕业时间",
					  time_istrue:0
				  })
				}else if(edu==="硕士"){
					this.setState({
						notice_msg:"运维高级项目经理-硕士毕业不少于3年",
						time_label:"毕业时间",
						time_istrue:0
					})
				  }else if(edu==="本科"){
					this.setState({
						notice_msg:"运维高级项目经理-本科毕业不少于5年",
						time_label:"毕业时间",
						time_istrue:0
					})
				  }else{
					this.setState({
						notice_msg:"完成运维项目经理登记的时间不少于3年",
						time_label:"运维项目经理登记时间",
						time_istrue:0
					})
				  }
				  
				
			}
			this.toggleDrawer(true)()
			}, () => {
			// console.log(getCache("info_completed"));
			var info_completed=getCache("info_completed");
			var info_completed_per=info_completed/20;
			console.log(info_completed_per);
			if(info_completed_per<1){
			this.popUpNotice("alert", 0, '企业相关信息完成'+info_completed_per*100+'%, 请先补全企业相关信息');
			return
			}
			console.log(student);
           //运维修改
			if(student.duty===null||student.department===null||student.mobile===null||student.mail===null){
			this.popUpNotice("alert", 0, '请先补全报名人员信息');
			return
			}
			this.state.selectedStudentId = student.id;
			this.setState({
				SignUpStudent:student,
				openSignUpDialog: true
			})
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
			):this.state.newStudents_comp.map(student =>
				<StudentCard
				type={CARD_TYPE_ENROLL}
				key={student.id}
				name={student.name === null ? "" : student.name.toString()}
				mobile={student.mobile === null ? "" : student.mobile.toString()}
				email={student.mail === null ? "" : student.mail.toString()}
				level={Number(student.course_id)}
				city={Number(student.area_id)}
				duty={student.duty === null ? "" : student.duty.toString()}
				department={student.department === null ? "" : student.department.toString()}
				institution={student.institution === null ? "" : Number(student.institution)}
			 is_inlist={student.is_inlist}
				action={[() => {
				this.selectedStudent(student);
				this.toggleDrawer(true)()
				}, () => {
				// console.log(getCache("info_completed"));
				var info_completed=getCache("info_completed");
				var info_completed_per=info_completed/20;
				console.log(info_completed);
				if(info_completed_per<1){
				this.popUpNotice("alert", 0, '企业相关信息完成'+info_completed_per*100+'%, 请先补全企业相关信息');
				return
				}
	
				if(student.duty===null||student.department===null||student.mobile===null||student.mail===null){
				this.popUpNotice("alert", 0, '请先补全报名人员信息');
				return
				}
				this.setState({
					SignUpStudent:student,
					openSignUpDialog: true
				})
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
			</div>
			</List>
			</Paper>
			<Paper style={{ padding: 0 }} className={'nyx-paper nyx-enroller-paper'}>
			<List style={{ padding: 0 }}>
			<div style={{ color:"#2196F3", marginBottom: "1rem" }} className="nyx-head-name">
			{Lang[window.Lang].pages.com.enrolled.unarrange} <i
			onClick={() => {
			if (this.state.unarranged_height == 0) {
			this.setState({ unarranged_height: 1 })
			} else {
			this.setState({ unarranged_height: 0 })
			}
			}}

			className="glyphicon glyphicon-menu-down nyx-flexible" aria-hidden="true"></i>
			</div>
			<div className={this.state.unarranged_height ? "nyx-list-paper" : "nyx-list-paper-change"}>
			{sessionStorage.classify==1?this.state.unarragedStudents.map(student => {

switch (student.is_cancel) {
case "0":
return (
<StudentCard
type={CARD_TYPE_UNARRANGE}
key={student.id}
name={student.name === null ? "" : student.name.toString()}
mobile={student.mobile === null ? "" : student.mobile.toString()}
email={student.mail === null ? "" : student.mail.toString()}
level={Number(student.course_id)}
city={Number(student.area_id)}
duty={student.duty === null ? "" : student.duty.toString()}
department={student.department === null ? "" : student.department.toString()}
institution={student.institution === null ? "" : Number(student.institution)}
is_inlist={student.is_inlist}
action={[() => {
this.state.cancel_reason="";
this.state.selectedStudentId = student.id;
student.is_inlist==1?
this.setState({
	openCancel:true,
	cancel_show_student_name:student.name,
	cancel_show_student_id:student.id
	})
// this.popUpNotice(ALERT, 0, "取消" + student.name + "报名", [
// () => {
// this.cancelEnroll(student.id);
// this.closeNotice();
// }, () => {
// this.closeNotice();
// }])
:this.setState({
openCancelReason:true,
cancel_student_name:student.name,
cancel_student_id:student.id
})
}]}
>
</StudentCard>)
case "1":
{
return (
<StudentCard
type={CARD_TYPE_UNARRANGE_ING}
key={student.id}
name={student.name === null ? "" : student.name.toString()}
mobile={student.mobile === null ? "" : student.mobile.toString()}
email={student.mail === null ? "" : student.mail.toString()}
level={Number(student.course_id)}
city={Number(student.area_id)}
duty={student.duty === null ? "" : student.duty.toString()}
department={student.department === null ? "" : student.department.toString()}
institution={student.institution === null ? "" : Number(student.institution)}
is_inlist={student.is_inlist}
action={[() => {
this.popUpNotice(ALERT, 0, "撤销" + student.name + "的取消报名", [
() => {
this.recall_cancel(student.cancel_id);
this.closeNotice();
}, () => {
this.closeNotice();
}])
}]}
>
</StudentCard>)
}
}
}):this.state.unarragedStudents_comp.map(student => {

	switch (student.is_cancel) {
	case "0":
	return (
	<StudentCard
	type={CARD_TYPE_UNARRANGE}
	key={student.id}
	name={student.name === null ? "" : student.name.toString()}
	mobile={student.mobile === null ? "" : student.mobile.toString()}
	email={student.mail === null ? "" : student.mail.toString()}
	level={Number(student.course_id)}
	city={Number(student.area_id)}
	duty={student.duty === null ? "" : student.duty.toString()}
	department={student.department === null ? "" : student.department.toString()}
	institution={student.institution === null ? "" : Number(student.institution)}
	is_inlist={student.is_inlist}
	action={[() => {
	this.state.cancel_reason="";
	this.state.selectedStudentId = student.id;
	student.is_inlist==1?
	this.setState({
		openCancel:true,
		cancel_show_student_name:student.name,
		cancel_show_student_id:student.id
		})
	// this.popUpNotice(ALERT, 0, "取消" + student.name + "报名", [
	// () => {
	// this.cancelEnroll(student.id);
	// this.closeNotice();
	// }, () => {
	// this.closeNotice();
	// }])
	:this.setState({
	openCancelReason:true,
	cancel_student_name:student.name,
	cancel_student_id:student.id
	})
	}]}
	>
	</StudentCard>)
	case "1":
	{
	return (
	<StudentCard
	type={CARD_TYPE_UNARRANGE_ING}
	key={student.id}
	name={student.name === null ? "" : student.name.toString()}
	mobile={student.mobile === null ? "" : student.mobile.toString()}
	email={student.mail === null ? "" : student.mail.toString()}
	level={Number(student.course_id)}
	city={Number(student.area_id)}
	duty={student.duty === null ? "" : student.duty.toString()}
	department={student.department === null ? "" : student.department.toString()}
	institution={student.institution === null ? "" : Number(student.institution)}
	is_inlist={student.is_inlist}
	action={[() => {
	this.popUpNotice(ALERT, 0, "撤销" + student.name + "的取消报名", [
	() => {
	this.recall_cancel(student.cancel_id);
	this.closeNotice();
	}, () => {
	this.closeNotice();
	}])
	}]}
	>
	</StudentCard>)
	}
	}
	})
			}
			
			</div>
			</List>
			</Paper>
			<Paper style={{ padding: 0 }} className={'nyx-paper nyx-enroller-paper'}>
			<List style={{ padding: 0 }}>
			<div style={{ color:"#2196F3", marginBottom: "1rem", position: "relative" }} className="nyx-head-name">
			{Lang[window.Lang].pages.com.enrolled.arranged} <i
			onClick={() => {
			if (this.state.arranged_height == 0) {
			this.setState({ arranged_height: 1 })
			} else {
			this.setState({ arranged_height: 0 })
			}
			}}

			className="glyphicon glyphicon-menu-down nyx-flexible" aria-hidden="true"></i>
			{/* <Button style={{ position: "absolute", right: "28px", top: "0" }} fab color="primary" aria-label="add" className={'nyx-paper-header-btn'}
			onClick={() => {
				this.resitDrawer(true)()
			
			}}
			>
			{"补考"}
			</Button> */}
			</div>
			<div className={this.state.arranged_height ? "nyx-list-paper" : "nyx-list-paper-change"}>
			{sessionStorage.classify==1?this.state.arrangedStudents.map(student => {

switch (student.is_inlist) {
case "3":
return (
<StudentCard
type={CARD_TYPE_ARRANGE}
key={student.id}
name={student.name === null ? "" : student.name.toString()}
mobile={student.mobile === null ? "" : student.mobile.toString()}
email={student.mail === null ? "" : student.mail.toString()}
level={Number(student.course_id)}
city={Number(student.area_id)}
duty={student.duty === null ? "" : student.duty.toString()}
department={student.department === null ? "" : student.department.toString()}
institution={student.institution === null ? "" : Number(student.institution)}
is_inlist={student.is_inlist}
action={[
() => {
this.state.selectedStudentId = student.id;
console.log(student.id);
var id = student.id;
var cb = (router, message, arg) => {
if (message.code === Code.LOGIC_SUCCESS) {
}
// this.popUpNotice(NOTICE, 0, message.msg);
// var class_code = message.data.classinfo.class_code!=null?"班级编号"+message.data.classinfo.class_code:"";
// var address = message.data.classinfo.address!=null?"地址"+message.data.classinfo.address:"";
var class_head = message.data.classinfo.class_head!=null?"班主任"+message.data.classinfo.class_head:"";
var mobile = message.data.classinfo.mobile!=null?"-班主任电话"+message.data.classinfo.mobile:"";
var address = message.data.classinfo.address!=null?"-地址"+message.data.classinfo.address:"";
var train_starttime = message.data.classinfo.train_starttime!=null?"-开班时间"+message.data.classinfo.train_starttime:"";
var message_data= class_head!=""?class_head+mobile+address+train_starttime:"暂无班级安排"
this.popUpNotice(ALERT, 0, message_data, [
() => {
//this.agreeArrange();
this.closeNotice();
}, () => {
this.closeNotice();
}]);
}
getData(getRouter(CLASS_INFO), { session: sessionStorage.session, id: student.id }, cb, { id: id });
},
() => {
this.state.selectedStudentId = student.id;

this.popUpNotice(ALERT, 0, "通过" + student.name + "课程安排？", [
() => {
this.refuseArrange();
this.closeNotice();
}, () => {
this.closeNotice();
}]);
}]}
>
</StudentCard>)
}
}):this.state.arrangedStudents_comp.map(student => {

	switch (student.is_inlist) {
	case "3":
	return (
	<StudentCard
	type={CARD_TYPE_ARRANGE}
	key={student.id}
	name={student.name === null ? "" : student.name.toString()}
	mobile={student.mobile === null ? "" : student.mobile.toString()}
	email={student.mail === null ? "" : student.mail.toString()}
	level={Number(student.course_id)}
	city={Number(student.area_id)}
	duty={student.duty === null ? "" : student.duty.toString()}
	department={student.department === null ? "" : student.department.toString()}
	institution={student.institution === null ? "" : Number(student.institution)}
	is_inlist={student.is_inlist}
	action={[
	() => {
	this.state.selectedStudentId = student.id;
	console.log(student.id);
	var id = student.id;
	var cb = (router, message, arg) => {
	if (message.code === Code.LOGIC_SUCCESS) {
	}
	// this.popUpNotice(NOTICE, 0, message.msg);
	// var class_code = message.data.classinfo.class_code!=null?"班级编号"+message.data.classinfo.class_code:"";
	// var address = message.data.classinfo.address!=null?"地址"+message.data.classinfo.address:"";
	var class_head = message.data.classinfo.class_head!=null?"班主任"+message.data.classinfo.class_head:"";
	var mobile = message.data.classinfo.mobile!=null?"-班主任电话"+message.data.classinfo.mobile:"";
	var address = message.data.classinfo.address!=null?"-地址"+message.data.classinfo.address:"";
	var train_starttime = message.data.classinfo.train_starttime!=null?"-开班时间"+message.data.classinfo.train_starttime:"";
	var message_data= class_head!=""?class_head+mobile+address+train_starttime:"暂无班级安排"
	this.popUpNotice(ALERT, 0, message_data, [
	() => {
	//this.agreeArrange();
	this.closeNotice();
	}, () => {
	this.closeNotice();
	}]);
	}
	getData(getRouter(CLASS_INFO), { session: sessionStorage.session, id: student.id }, cb, { id: id });
	},
	() => {
	this.state.selectedStudentId = student.id;

	this.popUpNotice(ALERT, 0, "通过" + student.name + "课程安排？", [
	() => {
	this.refuseArrange();
	this.closeNotice();
	}, () => {
	this.closeNotice();
	}]);
	}]}
	>
	</StudentCard>)
	}
	})
			}
			</div>
			</List>
			</Paper>
			{/* <Paper className={'nyx-paper nyx-enroller-paper'}>
				<List style={{ padding: 0 }}>
				<div style={{  color:"#2196F3", marginBottom: "1rem", position: "relative" }} className="nyx-head-name">
				{"补考报名列表"} <i
								onClick={() => {
									console.log(this.state.unarrageResits)
									if (this.state.resit_height == 0) {
									this.setState({ resit_height: 1 })
									} else {
									this.setState({ resit_height: 0 })
									}
									}}
                                className="glyphicon glyphicon-menu-down nyx-flexible" aria-hidden="true"></i>

                </div>             
					<div className={this.state.resit_height ? "nyx-list-paper" : "nyx-list-paper-change"}>
					{this.state.unarrageResits.map(student =>
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
					{this.state.arrageResits.map(student =>
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
							console.log(student.id);
							var id = student.id;
							var cb = (router, message, arg) => {
							if (message.code === Code.LOGIC_SUCCESS) {
							}
							// this.popUpNotice(NOTICE, 0, message.msg);
							// var class_code = message.data.classinfo.class_code!=null?"班级编号"+message.data.classinfo.class_code:"";
							// var address = message.data.classinfo.address!=null?"地址"+message.data.classinfo.address:"";
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
							console.log("已经安排")
							getData(getRouter(RESIT_CLASSINFO), { session: sessionStorage.session, resit_id: student.id }, cb, { id: id });
							}
						
				
					]}>
					</StudentCard>
					)}
					</div>
			</List>
			</Paper> */}

			<Drawer
			anchor="right"
			open={this.state.right}
			onRequestClose={this.toggleDrawer(false)}
			>
			<div
			tabIndex={0}
			role="button"
			// onClick={this.toggleDrawer(false)}
			// onKeyDown={this.toggleDrawer(false)}
			>
			<Paper className="nyx-enrolled-change-drawer" style={{boxShadow:"none"}} elevation={4}>
			<h2 className="nyx-enrolled-change-title">
			{Lang[window.Lang].pages.com.students.base_info}
			</h2>
			<TextField
			id="student_name"
			label={Lang[window.Lang].pages.com.students.name}
			defaultValue={this.state.selected.name ? this.state.selected.name : ""}
			fullWidth
			disabled={this.state.selected.a_id == -1 ? true : false}
			/>
			<TextField
			style={{marginTop:"1em"}}
			id="licence.code"
			label={Lang[window.Lang].pages.com.students.personal_info.licence_code[1]}
			defaultValue={this.state.selected.identity_card ? this.state.selected.identity_card : ""}
			disabled={this.state.selected.a_id == -1 ? true : false}
			fullWidth>
			</TextField>
			<p className="nyx-card-enrroll-select-label-lg">
			课程名称
			</p>
			{/* 运维修改 */}
			{sessionStorage.classify==2?
			<select
			className={this.state.selected.a_id == -1 ?"nyx-card-enrroll-select-lg-dashed":"nyx-card-enrroll-select-lg"}
			id={"student_course_id"}
			onChange = {(e) =>{
				this.change_select_course_id(e);
			}}
			defaultValue={this.state.selected.course_id ? this.state.selected.course_id : ""}
			//disabled={true}
			>
		      <option key={3} value={3}>运维项目经理</option>
			  <option key={4} value={4}>高级运维项目经理</option>
			</select>:""}
			{/* 运维修改 */}
			{/* <select
			className={this.state.selected.a_id == -1 ?"nyx-card-enrroll-select-lg-dashed":"nyx-card-enrroll-select-lg"}
			id={"student_course_id"}
			defaultValue={this.state.selected.course_id ? this.state.selected.course_id : ""}
			disabled={this.state.selected.a_id == -1 ? true : false}
			>
			{getCourses().map(course => {
                return <option key={course.id} value={course.id}>{course.course_name}</option>
             })}
			</select> */}
			<p className="nyx-card-enrroll-select-label-lg">培训城市</p>
			<select
			className={this.state.selected.a_id == -1 ?"nyx-card-enrroll-select-lg-dashed":"nyx-card-enrroll-select-lg"}
			id="change_area_id"
			defaultValue={this.state.selected.area_id === null ? "" : this.state.selected.area_id}
			label={Lang[window.Lang].pages.org.clazz.info.area}
			>
			{this.getAreas_co()}
			</select>

			{/* <FormControl required>
			<FormLabel>{"等级"}</FormLabel>
			<RadioGroup
			style={{ display: "block" }}
			aria-label="gender"
			name="gender"
			selectedValue={this.state.course}
			onChange={(e, value) => {
			this.handleChangeCourse(e, value)
			}}
			>
			<LabelRadio value={"1"} label="运维项目经理" />
			<LabelRadio value={"2"} label="运维高级项目经理" />
			</RadioGroup>
			</FormControl> */}
			<TextField
			style={{marginTop:"1em"}}
			id="register"
			label={Lang[window.Lang].pages.com.students.register}
			defaultValue={this.state.selected.register ? this.state.selected.register : ""}
			disabled={this.state.selected.a_id == -1 ? true : false}
			fullWidth>
			</TextField>

			<h2 className="nyx-enrolled-change-title" style={{marginTop:20}}>
			{Lang[window.Lang].pages.com.students.personal_info.title}
			</h2>
			<TextField
			id="department"
			label={Lang[window.Lang].pages.com.students.personal_info.department}
			defaultValue={this.state.selected.department ? this.state.selected.department : ""}
			fullWidth>
			</TextField>
			<TextField
			style={{marginTop:"1em"}}
			id="duty"
			label={Lang[window.Lang].pages.com.students.personal_info.duty}
			defaultValue={this.state.selected.duty ? this.state.selected.duty : ""}
			fullWidth>
			</TextField>
			<TextField
			style={{marginTop:"1em"}}
			id="mobile"
			label={Lang[window.Lang].pages.com.students.tel}
			defaultValue={this.state.selected.mobile ? this.state.selected.mobile : ""}
			fullWidth
			/>
			<TextField
			id="mail"
			style={{marginTop:"1em"}}
			label={Lang[window.Lang].pages.com.students.email}
			defaultValue={this.state.selected.mail ? this.state.selected.mail : ""}
			fullWidth
			/>
			<TextField
			id="wechat"
			style={{marginTop:"1em"}}
			label={Lang[window.Lang].pages.com.students.personal_info.wechat}
			defaultValue={this.state.selected.wechat ? this.state.selected.wechat : ""}
			fullWidth
			/>
			<p className="nyx-card-enrroll-select-label-lg">
			学历
			</p>
			{/* 运维修改 */}
			
			<select
			onChange={(e)=>{
				this.change_select_edu(e)
			}}
			className={this.state.selected.a_id == -1 ?"nyx-card-enrroll-select-lg-dashed":"nyx-card-enrroll-select-lg"}
			defaultValue={this.state.selected.education ? this.state.selected.education : ""}
			id={"change_education"}
			//defaultValue={this.state.selected.course_id ? this.state.selected.course_id : ""}
			>
		        <option value={"博士"}>{"博士"}</option>
				<option value={"硕士"}>{"硕士"}</option>
				<option value={"本科"}>{"本科"}</option>
				<option value={"大专"}>{"大专"}</option>
				<option value={"大专以下"}>{"大专以下"}</option>
			</select>
			<div
              style={{top:"1.2rem",width:"100%"}}
			   className="nyx-input-date nyx-form-div nyx-clazz-message"
			   >
			   <span 
			    style={{top:"-5px"}}
			   >{this.state.time_label}</span>
				<input
			   // id="train_starttime"
				 style={{width:"100%",marginTop:"15px"}}
				  type="date"
				  id="change_graduation_time"
				  onChange={(event) => {
					this.change_select_times(document.getElementById("change_graduation_time").value);
				  }}
				  defaultValue={this.state.selected.graduation_time}
				/>
				<span  style={this.state.time_istrue==0?{position:"relative",top:0,color:"#2196F3"}:{position:"relative",top:0,color:"red"}}>{this.state.notice_msg}</span>

			   </div> 
			{/* <TextField
			id={"detail"}
			style={{marginTop:"1em"}}
			label={Lang[window.Lang].pages.com.students.input.detail}
			helperText={Lang[window.Lang].pages.com.students.input.detail_helper}
			defaultValue={this.state.selected.detail ? this.state.selected.detail : ""}
			fullWidth
			/> */}
			<Button
			style={{backgroundColor:"#2196f3", color:"#FFF",margin: 10,marginTop:"40px", float: "right" }}
			onClick={(e) => {
			this.modifyStudent(e)
			}}>
			{Lang[window.Lang].pages.main.certain_button}
			</Button>
			</Paper>
			</div>
			</Drawer>
			<Drawer
                       
                        anchor="right"
                        open={this.state.resitright}
                        onRequestClose={this.resitDrawer(false)}
                    >
					 <div style={{width:"600px"}}> 
					 <Button
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
					</Button>     
					 <div style={{marginTop:"3rem"}}>
					 <p className="nyx-resit-name" style={{width:"80px",marginLeft:"3.3rem"}}>姓名</p>
					 <p className="nyx-resit-name" style={{width:"150px"}}>科目</p>
					 <span className="nyx-resit-name" style={{width:"150px"}}>地区</span>
					 {sessionStorage.classify==1?this.state.arrangedStudents.map(resit_student => {

switch (resit_student.is_inlist) {
case "3":
return (
<div key={resit_student.id}>
<input 
style={{margin:"1rem 0.5rem 0 2rem",height:"16px"}}
name={"resitselected"}
value={resit_student.id}
type="checkbox"/> 
<div
	title={resit_student.name}
	className="nyx-clazz-student-message"
	style={{width:"80px"}}
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
{/* 
<div
	title={cancel_list.reason}
	className="nyx-clazz-student-message"
	style={{width:"200px"}}
>{cancel_list.reason}</div> */}
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
	style={{ position:"relative",top:"3px",minHeight:"26px",float:"right",right:"2rem"}}
>
	{"报名"}
</Button>

</div>
)
}
}):this.state.arrangedStudents_comp.map(resit_student => {

	switch (resit_student.is_inlist) {
	case "3":
	return (
	<div key={resit_student.id}>
	<input 
	style={{margin:"1rem 0.5rem 0 2rem",height:"16px"}}
	name={"resitselected"}
	value={resit_student.id}
	type="checkbox"/> 
	<div
		title={resit_student.name}
		className="nyx-clazz-student-message"
		style={{width:"80px"}}
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
	{/* 
	<div
		title={cancel_list.reason}
		className="nyx-clazz-student-message"
		style={{width:"200px"}}
	>{cancel_list.reason}</div> */}
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
		style={{ position:"relative",top:"3px",minHeight:"26px",float:"right",right:"2rem"}}
	>
		{"报名"}
	</Button>

	</div>
	)
	}
	})}
					 </div>
			
					</div>
					</Drawer>
			{this.newStudentDialog()}
			{this.cancel_reason()}
			{this.cancel_show()}
			{this.SignUpDialog(this.state.SignUpStudent)}
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

export default Enrolled_Comp;