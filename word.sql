/*
Navicat MySQL Data Transfer

Source Server         : localhost
Source Server Version : 80015
Source Host           : 127.0.0.1:3306
Source Database       : word

Target Server Type    : MYSQL
Target Server Version : 80015
File Encoding         : 65001

Date: 2022-04-26 22:21:44
*/

SET FOREIGN_KEY_CHECKS=0;

-- ----------------------------
-- Table structure for adjustcourse
-- ----------------------------
DROP TABLE IF EXISTS `adjustcourse`;
CREATE TABLE `adjustcourse` (
  `id` int(32) unsigned NOT NULL AUTO_INCREMENT,
  `user_id` int(32) DEFAULT NULL COMMENT '录入数据的用户id',
  `date` timestamp NOT NULL COMMENT '时间',
  `section` tinyint(1) NOT NULL COMMENT '节次',
  `username` varchar(255) CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL COMMENT '申请调课的教师',
  `reason` text CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL COMMENT '申请调课原因',
  `grade` char(1) CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL COMMENT '年级',
  `gclass` char(1) CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL COMMENT '班级',
  `attribute` tinyint(1) DEFAULT NULL COMMENT '属性（1为自习，2为上课）',
  `remarks` text CHARACTER SET utf8 COLLATE utf8_unicode_ci COMMENT '申请调课的备注',
  `status` int(11) DEFAULT '0' COMMENT '调课状态（0：未处理；1：同意；2：拒绝）',
  `adjust_teacher` varchar(255) CHARACTER SET utf8 COLLATE utf8_unicode_ci DEFAULT NULL COMMENT '被调课教师',
  `adjust_time` timestamp NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP COMMENT '调整时间',
  `adjust_section` tinyint(1) DEFAULT NULL COMMENT '调整节次',
  `refuse` text CHARACTER SET utf8 COLLATE utf8_unicode_ci COMMENT '拒绝调课原因',
  `res_remarks` text CHARACTER SET utf8 COLLATE utf8_unicode_ci COMMENT '管理员调课备注',
  `create_time` timestamp NULL DEFAULT NULL COMMENT '新增时间',
  `update_time` timestamp NULL DEFAULT NULL,
  `delete_time` timestamp NULL DEFAULT NULL COMMENT '删除时间',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- ----------------------------
-- Records of adjustcourse
-- ----------------------------
INSERT INTO `adjustcourse` VALUES ('1', '2', '2022-04-27 08:00:00', '0', '测试2', 'test', '7', '1', null, '', '0', null, '2022-04-26 21:26:09', null, null, null, '2022-04-26 21:19:46', null, '2022-04-26 21:26:09');
INSERT INTO `adjustcourse` VALUES ('2', '2', '2022-04-27 08:00:00', '0', '测试2', 'test2', '7', '1', '1', '', '1', '测试1', '2022-04-28 08:00:00', '0', null, '', '2022-04-26 21:29:40', '2022-04-26 21:34:27', null);

-- ----------------------------
-- Table structure for role
-- ----------------------------
DROP TABLE IF EXISTS `role`;
CREATE TABLE `role` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `role_name` char(10) CHARACTER SET utf8 COLLATE utf8_unicode_ci DEFAULT NULL COMMENT '角色名称',
  `description` varchar(255) CHARACTER SET utf8 COLLATE utf8_unicode_ci DEFAULT NULL COMMENT '角色描述',
  `create_time` timestamp NULL DEFAULT NULL COMMENT 'create_time',
  `update_time` timestamp NULL DEFAULT NULL COMMENT '更新时间',
  `delete_time` timestamp NULL DEFAULT NULL COMMENT '删除时间',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- ----------------------------
-- Records of role
-- ----------------------------
INSERT INTO `role` VALUES ('1', '总管理员', '程序所有权限', '2022-02-23 21:36:54', null, null);
INSERT INTO `role` VALUES ('2', '普通管理员', '程序的个别权限', '2022-02-23 21:37:22', null, null);
INSERT INTO `role` VALUES ('3', '教师', '只可以申请调课', '2022-02-23 21:37:41', null, null);

-- ----------------------------
-- Table structure for user
-- ----------------------------
DROP TABLE IF EXISTS `user`;
CREATE TABLE `user` (
  `id` int(32) unsigned NOT NULL AUTO_INCREMENT,
  `username` varchar(255) CHARACTER SET utf8 COLLATE utf8_unicode_ci DEFAULT NULL COMMENT '教师名字',
  `job_number` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL COMMENT '教师工号',
  `role_id` int(11) DEFAULT NULL COMMENT '角色id',
  `identify` int(11) DEFAULT '0' COMMENT '是否认证（1是；2否）',
  `refuse_reason` text CHARACTER SET utf8 COLLATE utf8_unicode_ci COMMENT '拒绝认证的原因',
  `nickname` varchar(255) CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL COMMENT '微信名',
  `telephone` char(11) COLLATE utf8_unicode_ci DEFAULT NULL COMMENT '电话号码',
  `gender` tinyint(1) NOT NULL COMMENT '性别',
  `avatar` varchar(255) CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL COMMENT '微信头像',
  `openid` varchar(255) CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL COMMENT '微信的openid',
  `create_time` timestamp NULL DEFAULT NULL COMMENT '新增时间',
  `update_time` timestamp NULL DEFAULT NULL COMMENT '更新时间',
  `delete_time` timestamp NULL DEFAULT NULL COMMENT '删除时间',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- ----------------------------
-- Records of user
-- ----------------------------
INSERT INTO `user` VALUES ('1', '测试1', '123451', '1', '1', null, 'lyinen', '', '0', 'https://thirdwx.qlogo.cn/mmopen/vi_32/CI0JnCIIVZibXfkw8ErDeZkyMInicu3pOQC9B2MZQvYo4z0rNXScAic8pI3cE01TSMiaLmTIA8Q3aTSWDn9AuOF0Qw/132', 'ouuKp54DkjtFIKLKfKumZlTueo70', '2022-04-26 21:00:07', '2022-04-26 21:35:31', null);
INSERT INTO `user` VALUES ('2', '测试2', '123452', '3', '1', null, '信', '', '0', 'https://thirdwx.qlogo.cn/mmopen/vi_32/0NNL244MVpxDRwPj3gScx4tjMh9vpicVv1GjkdoLNo0Nia6Pxiamib0arJvfwicfp8wtibZIXgQpGTiaibZnLBn3PgajBw/132', 'ouuKp5y1gbLJXOMEjzz-HQtZDqGI', '2022-04-26 21:12:59', '2022-04-26 21:16:02', null);
