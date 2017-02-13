var Addon_Id = "sidetreeview";

if (window.Addon == 1) {
	Addons.SideTreeView =
	{
		Align: GetAddonOptionEx(Addon_Id, "Align") ? "Right" : "Left",
		Depth: GetAddonOptionEx(Addon_Id, "Depth"),
		Width: 0,

		Init: function ()
		{
			this.Width = te.Data["Conf_" + this.Align + "BarWidth"];
			if (!this.Width) {
				this.Width = 178;
				te.Data["Conf_" + this.Align + "BarWidth"] = this.Width;
			}
			SetAddon(Addon_Id, this.Align + "Bar2", ['<div id="sidetreeview" style="width: ', this.Width, 'px; height: 100%"></div>']);
			this.TV = te.CreateCtrl(CTRL_TV);
			this.TV.Visible = true;
		},

		Expand: function (Ctrl)
		{
			if (Ctrl.FolderItem && !/^search\-ms:/i.test(api.GetDisplayNameOf(Ctrl.FolderItem, SHGDN_FORPARSING | SHGDN_FORADDRESSBAR))) {
				var TV = Addons.SideTreeView.TV;
				if (TV) {
					if (Addons.SideTreeView.tid) {
						clearTimeout(Addons.SideTreeView.tid);
						delete Addons.SideTreeView.tid;
					}
					TV.Expand(Ctrl.FolderItem, Addons.SideTreeView.Depth);
					Addons.SideTreeView.tid = setTimeout(function ()
					{
						delete Addons.SideTreeView.tid;
						TV.Expand(Ctrl.FolderItem, 0);
					}, 500);
				}
			}
		}
	};

	Addons.SideTreeView.Init();

	AddEvent("ChangeView", Addons.SideTreeView.Expand);

	AddEvent("Finalize", function ()
	{
		Addons.SideTreeView.TV.Close();
	});

	AddEvent("Resize", function ()
	{
		var o = document.getElementById("sidetreeview");
		var pt = GetPos(o);
		api.MoveWindow(Addons.SideTreeView.TV.hwnd, pt.x, pt.y, o.offsetWidth, o.offsetHeight, true);
	});
} else {
	SetTabContents(0, "General", '<div><label>Align</label></div><input type="hidden" name="Align" /><input type="radio" name="_Align" id="Align=0" onclick="SetRadio(this)" /><label for="Align=0">Left</label><input type="radio" name="_Align" id="Align=1" onclick="SetRadio(this)" /><label for="Align=1">Right</label><input type="checkbox" id="Depth" value="1" /><label for="Depth">Expanded</label>');
}