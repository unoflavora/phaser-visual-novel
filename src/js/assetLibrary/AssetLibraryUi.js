import { AssetType } from 'Modules/assetLoader';

export const UIAsset = {
  login_brown_box: {
		key: "login_brown_box",
		path: "/img/ui/login/login_brown_box.png",
		type: AssetType.STATIC,
	},

  //#region Confirm New Password
	confirm_newPassword_text: {
		key: "confirm_newPassword_text",
		path: "/img/ui/createNewPassword/confirm_newPassword_text.png",
		type: AssetType.STATIC,
	},
	create_newPassword_text: {
		key: "create_newPassword_text",
		path: "/img/ui/createNewPassword/create_newPassword_text.png",
		type: AssetType.STATIC,
	},
	new_password_text: {
		key: "new_password_text",
		path: "/img/ui/createNewPassword/new_password_text.png",
		type: AssetType.STATIC,
	},
	update_password_button: {
		key: "update_password_button",
		path: "/img/ui/createNewPassword/update_password_button.png",
		type: AssetType.STATIC,
	},
	backToLogin_button: {
		key: "backToLogin_button",
		path: "/img/ui/createNewPassword/backToLogin_button.png",
		type: AssetType.STATIC,
	},
	//#endregion 

  cover_black: {
    key: 'cover_black',
    path: '/img/ui/cover_black.png',
    type: AssetType.STATIC,
  },
  language_flag_id: {
		key: "language_flag_id",
		path: "/img/ui/selectLanguage/indonesia.png",
		type: AssetType.STATIC
	},
	language_flag_en: {
		key: "language_flag_en",
		path: "/img/ui/selectLanguage/english.png",
		type: AssetType.STATIC
	},
  game_title: {
    key: "T_Logo_GameTitle",
		path: "/img/ui/T_Logo_GameTitle.png",
		type: AssetType.STATIC
  },
  button_frame_primary: 
  {
    key: "button_frame_primary",
    path: "/img/ui/icons/ui-icon-frame-primary.png",
    type: AssetType.STATIC
  },
  button_frame_secondary: 
  {
    key: "button_frame_secondary",
    path: "/img/ui/icons/ui-icon-frame-secondary.png",
    type: AssetType.STATIC
  },

  	// #region General
	pause_button: {
		key: "pause_button",
		path: "/img/ui/general/pause_button.png",
		type: AssetType.STATIC,
	},
	bg_text_box: {
		key: "red_text_box",
		path: "/img/ui/general/ui-textbox.png",
		type: AssetType.STATIC,
	},
	// #endregion

	// #region Login
	popup_background: {
		key: "popup_background",
		path: "/img/ui/popups/ui-frame.png",
		type: AssetType.STATIC,
	},
	icon_visibility: 
	{
		key: "icon_visibility",
		path: "/img/ui/icons/ui-icon-visibility.png",
		type: AssetType.STATIC
	}
};

export const BackgroundAsset = 
{
  background_main: 
  {
    key: "background_main",
    path: "/img/background/background_main.png",
    type: AssetType.STATIC,
  }
} 