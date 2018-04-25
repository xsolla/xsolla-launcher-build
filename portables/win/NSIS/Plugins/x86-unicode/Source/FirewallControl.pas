{
License Agreement

This content is subject to the Mozilla Public License Version 1.1 (the "License");
You may not use this plugin except in compliance with the License. You may 
obtain a copy of the License at http://www.mozilla.org/MPL. 

Alternatively, you may redistribute this library, use and/or modify it 
under the terms of the GNU Lesser General Public License as published 
by the Free Software Foundation; either version 2.1 of the License, 
or (at your option) any later version. You may obtain a copy 
of the LGPL at www.gnu.org/copyleft. 

Software distributed under the License is distributed on an "AS IS" basis, 
WITHOUT WARRANTY OF ANY KIND, either express or implied. See the License 
for the specific language governing rights and limitations under the License. 

The original code is FirewallControl.pas, released April 16, 2007. 

The initial developer of the original code is Rainer Budde (http://www.speed-soft.de). 

SimpleFC - NSIS Firewall Control Plugin is written, published and maintaned by
Rainer Budde (rainer@speed-soft.de).
}
unit FirewallControl;

interface

uses
  NetFwTypeLib_TLB, ComObj, ActiveX, Variants, ServiceControl;

  function AddPort(Port: Integer; Name: String; Protocol: NET_FW_IP_PROTOCOL_; Scope: NET_FW_SCOPE_; IpVersion: NET_FW_IP_VERSION_; RemoteAddresses: String; Enabled: Boolean): HRESULT;
  function RemovePort(Port: Integer; Protocol: NET_FW_IP_PROTOCOL_): HRESULT;
  function AddApplication(Name: String; BinaryPath: String; Scope: NET_FW_SCOPE_; IpVersion: NET_FW_IP_VERSION_; RemoteAdresses: String; Enabled: Boolean): HRESULT;
  function RemoveApplication(BinaryPath: String): HRESULT;
  function IsPortAdded(Port: Integer; Protocol: NET_FW_IP_PROTOCOL_; var Added: Boolean): HRESULT;
  function IsApplicationAdded(BinaryPath: String; var Added: Boolean): HRESULT;
  function IsPortEnabled(Port: Integer; Protocol: NET_FW_IP_PROTOCOL_; var Enabled: Boolean): HRESULT;
  function IsApplicationEnabled(BinaryPath: String; var Enabled: Boolean): HRESULT;
  function EnableDisablePort(Port: Integer; Protocol: NET_FW_IP_PROTOCOL_; Enabled: Boolean): HRESULT;
  function EnableDisableApplication(BinaryPath: String; Enabled: Boolean): HRESULT;
  function IsFirewallEnabled(var Enabled: Boolean): HRESULT;
  function EnableDisableFirewall(Enabled: Boolean): HRESULT;
  function AllowDisallowExceptionsNotAllowed(NotAllowed: Boolean): HRESULT;
  function AreExceptionsNotAllowed(var NotAllowed: Boolean): HRESULT;
  function EnableDisableNotifications(Enabled: Boolean): HRESULT;
  function AreNotificationsEnabled(var Enabled: Boolean): HRESULT;
  function IsFirwallServiceRunning(var IsRunning: Boolean): Boolean;
  function StartStopFirewallService(Enabled: Boolean): Boolean;

implementation

const
  FW_MGR_CLASS_NAME = 'HNetCfg.FwMgr';
  FW_OPENPORT_CLASS_NAME = 'HNetCfg.FwOpenPort';
  FW_AUTHORIZED_APPLICATION = 'HNetCfg.FwAuthorizedApplication';
  FW_SERVICE_XP_WIN2003 = 'SharedAccess';
  FW_SERVICE_VISTA = 'MpsSvc';

function AddPort(Port: Integer; Name: String; Protocol: NET_FW_IP_PROTOCOL_; Scope: NET_FW_SCOPE_; IpVersion: NET_FW_IP_VERSION_; RemoteAddresses: String; Enabled: Boolean): HRESULT;
var
  FwMgrDisp: IDispatch;
  FwMgr: INetFwMgr;
  FwProfile: INetFwProfile;
  FwOpenPortDisp: IDispatch;
  FwOpenPort: INetFwOpenPort;
  RemoteAddressesW: PWideChar;
begin
  Result := S_OK;

  try
    FwMgrDisp := CreateOleObject(FW_MGR_CLASS_NAME);
    try
      FwMgr := INetFwMgr(FwMgrDisp);

      FwProfile := FwMgr.LocalPolicy.CurrentProfile;

      FwOpenPortDisp := CreateOleObject(FW_OPENPORT_CLASS_NAME);
      try
        FwOpenPort := INetFwOpenPort(FwOpenPortDisp);

        GetMem(RemoteAddressesW, Length(RemoteAddresses) * SizeOf(WideChar) + 1);
        try
          StringToWideChar(RemoteAddresses, RemoteAddressesW, Length(RemoteAddresses) * SizeOf(WideChar) + 1);

          FwOpenPort.Port := Port;
          FwOpenPort.Name := Name;
          FwOpenPort.Protocol := Protocol;

          if (Scope = NET_FW_SCOPE_ALL) or (Scope = NET_FW_SCOPE_LOCAL_SUBNET) then
            FwOpenPort.Scope := Scope
          else
            FwOpenPort.RemoteAddresses := RemoteAddressesW;

          FwOpenPort.IpVersion := IpVersion;
          FwOpenPort.Enabled := Enabled;

          FwProfile.GloballyOpenPorts.Add(FwOpenPort);

        finally
          FreeMem(RemoteAddressesW);
        end;

      finally
        FwOpenPortDisp := Unassigned;
      end;
    finally
      FwMgrDisp := Unassigned;
    end;
  except
    on E:EOleSysError do
      Result := E.ErrorCode;
  end;
end;

function RemovePort(Port: Integer; Protocol: NET_FW_IP_PROTOCOL_): HRESULT;
var
  FwMgrDisp: IDispatch;
  FwMgr: INetFwMgr;
  FwProfile: INetFwProfile;
begin
  Result := S_OK;

  try
    FwMgrDisp := CreateOleObject(FW_MGR_CLASS_NAME);
    try
      FwMgr := INetFwMgr(FwMgrDisp);

      FwProfile := FwMgr.LocalPolicy.CurrentProfile;
      FwProfile.GloballyOpenPorts.Remove(Port, Protocol);
    finally
      FwMgrDisp := Unassigned;
    end;
  except
    on E:EOleSysError do
      Result := E.ErrorCode;
  end;
end;

function AddApplication(Name: String; BinaryPath: String; Scope: NET_FW_SCOPE_; IpVersion: NET_FW_IP_VERSION_; RemoteAdresses: String; Enabled: Boolean): HRESULT;
var
  FwMgrDisp: IDispatch;
  FwMgr: INetFwMgr;
  FwProfile: INetFwProfile;
  FwAppDisp: IDispatch;
  FwApp: INetFwAuthorizedApplication;
  RemoteAddressesW: PWideChar;
begin
  Result := S_OK;

  try
    FwMgrDisp := CreateOleObject(FW_MGR_CLASS_NAME);
    try
      FwMgr := INetFwMgr(FwMgrDisp);

      FwProfile := FwMgr.LocalPolicy.CurrentProfile;

      FwAppDisp := CreateOleObject(FW_AUTHORIZED_APPLICATION);
      try
        FwApp := INetFwAuthorizedApplication(FwAppDisp);

        GetMem(RemoteAddressesW, Length(RemoteAdresses) * SizeOf(WideChar) + 1);
        try
          StringToWideChar(RemoteAdresses, RemoteAddressesW, Length(RemoteAdresses) * SizeOf(WideChar) + 1);

          FwApp.Name := Name;
          FwApp.ProcessImageFileName := BinaryPath;
          FwApp.IpVersion := IpVersion;

          if (Scope = NET_FW_SCOPE_ALL) or (Scope = NET_FW_SCOPE_LOCAL_SUBNET) then
            FwApp.Scope := Scope
          else
            FwApp.RemoteAddresses := RemoteAddressesW;

          FwApp.Enabled := Enabled;

          FwProfile.AuthorizedApplications.Add(FwApp);

        finally
          FreeMem(RemoteAddressesW)
        end;
      finally
        FwAppDisp := Unassigned;
      end;
    finally
      FwMgrDisp := Unassigned;
    end;
  except
    on E:EOleSysError do
      Result := E.ErrorCode;
  end;
end;

function RemoveApplication(BinaryPath: String): HRESULT;
var
  FwMgrDisp: IDispatch;
  FwMgr: INetFwMgr;
  FwProfile: INetFwProfile;
begin
   Result := S_OK;

   try
     FwMgrDisp := CreateOleObject(FW_MGR_CLASS_NAME);
     try
       FwMgr := INetFwMgr(FwMgrDisp);

       FwProfile := FwMgr.LocalPolicy.CurrentProfile;
       FwProfile.AuthorizedApplications.Remove(BinaryPath);
     finally
       FwMgrDisp := Unassigned;
     end; 
   except 
     on E:EOleSysError do 
       Result := E.ErrorCode;
   end;
end;

function IsPortAdded(Port: Integer; Protocol: NET_FW_IP_PROTOCOL_; var Added: Boolean): HRESULT;
var
  FwMgrDisp: IDispatch;
  FwMgr: INetFwMgr;
  FwProfile: INetFwProfile;
  FwOpenPort: INetFwOpenPort;
  FwOpenPortInstances: IEnumVariant;
  TempFwPortObj: OleVariant;
  TempObjValue: Cardinal;
  EnumerateNext: Boolean;
begin
  Result := S_OK;
  Added := False;
  EnumerateNext := True;

  try
    FwMgrDisp := CreateOleObject(FW_MGR_CLASS_NAME);
    try
      FwMgr := INetFwMgr(FwMgrDisp);

      FwProfile := FwMgr.LocalPolicy.CurrentProfile;
      FwOpenPortInstances := FwProfile.GloballyOpenPorts.Get__NewEnum as IEnumVariant;

      while EnumerateNext and not Added do
        if FwOpenPortInstances.Next(1, TempFwPortObj, TempObjValue) <> 0 then
          EnumerateNext := False
        else
        begin
          FwOpenPort := IUnknown(TempFwPortObj) as INetFwOpenPort;

          Added := (FwOpenPort.Port = Port) and (FwOpenPort.Protocol = Protocol)
        end;

    finally
      FwMgrDisp := Unassigned;
    end;
  except
    on E:EOleSysError do
      Result := E.ErrorCode;
  end;
end;

function IsApplicationAdded(BinaryPath: String; var Added: Boolean): HRESULT;
var
  FwMgrDisp: IDispatch;
  FwMgr: INetFwMgr;
  FwProfile: INetFwProfile;
  FwApp: INetFwAuthorizedApplication;
  FwAppInstances: IEnumVariant;
  TempFwApp: OleVariant;
  TempObjValue: Cardinal;
  EnumerateNext: Boolean;
begin
  Result := S_OK;
  Added := False;
  EnumerateNext := True;

  try
    FwMgrDisp := CreateOleObject(FW_MGR_CLASS_NAME);
    try
      FwMgr := INetFwMgr(FwMgrDisp);

      FwProfile := FwMgr.LocalPolicy.CurrentProfile;
      FwAppInstances := FwProfile.AuthorizedApplications.Get__NewEnum as IEnumVariant;

      while EnumerateNext and not Added do
        if FwAppInstances.Next(1, TempFwApp, TempObjValue) <> 0 then
          EnumerateNext := False
        else
        begin
          FwApp := IUnknown(TempFwApp) as INetFwAuthorizedApplication;

          Added := FwApp.ProcessImageFileName = BinaryPath
        end;

    finally
      FwMgrDisp := Unassigned;
    end;
  except
    on E:EOleSysError do
      Result := E.ErrorCode;
  end;
end;

function IsPortEnabled(Port: Integer; Protocol: NET_FW_IP_PROTOCOL_; var Enabled: Boolean): HRESULT;
var
  FwMgrDisp: IDispatch;
  FwMgr: INetFwMgr;
  FwProfile: INetFwProfile;
  FwOpenPort: INetFwOpenPort;
  FwOpenPortInstances: IEnumVariant;
  TempFwPortObj: OleVariant;
  TempObjValue: Cardinal;
  EnumerateNext: Boolean;
begin
  Result := S_OK;
  Enabled := False;
  EnumerateNext := True;

  try
    FwMgrDisp := CreateOleObject(FW_MGR_CLASS_NAME);
    try
     FwMgr := INetFwMgr(FwMgrDisp);

     FwProfile := FwMgr.LocalPolicy.CurrentProfile;
     FwOpenPortInstances := FwProfile.GloballyOpenPorts.Get__NewEnum as IEnumVariant;

     while EnumerateNext do
       if FwOpenPortInstances.Next(1, TempFwPortObj, TempObjValue) <> 0 then
         EnumerateNext := False
       else
       begin
         FwOpenPort := IUnknown(TempFwPortObj) as INetFwOpenPort;

         if (FwOpenPort.Port = Port) and (FwOpenPort.Protocol = Protocol) then
         begin
           Enabled := FwOpenPort.Enabled;
           EnumerateNext := False;
         end;

       end;

    finally
     FwMgrDisp := Unassigned;
    end;
  except
    on E:EOleSysError do
      Result := E.ErrorCode;
  end;
end;

function IsApplicationEnabled(BinaryPath: String; var Enabled: Boolean): HRESULT;
var
  FwMgrDisp: IDispatch;
  FwMgr: INetFwMgr;
  FwProfile: INetFwProfile;
  FwApp: INetFwAuthorizedApplication;
  FwAppInstances: IEnumVariant;
  TempFwApp: OleVariant;
  TempObjValue: Cardinal;
  EnumerateNext: Boolean;
begin
  Result := S_OK;
  Enabled := False;
  EnumerateNext := True;

  try
    FwMgrDisp := CreateOleObject(FW_MGR_CLASS_NAME);
    try
      FwMgr := INetFwMgr(FwMgrDisp);

      FwProfile := FwMgr.LocalPolicy.CurrentProfile;
      FwAppInstances := FwProfile.AuthorizedApplications.Get__NewEnum as IEnumVariant;

      while EnumerateNext do
       if FwAppInstances.Next(1, TempFwApp, TempObjValue) <> 0 then
         EnumerateNext := False
       else
       begin
         FwApp := IUnknown(TempFwApp) as INetFwAuthorizedApplication;

         if FwApp.ProcessImageFileName = BinaryPath then
         begin
           Enabled := FwApp.Enabled;
           EnumerateNext := False;
         end;

       end;

    finally
     FwMgrDisp := Unassigned;
    end;
  except
    on E:EOleSysError do
      Result := E.ErrorCode;
  end;
end;

function EnableDisablePort(Port: Integer; Protocol: NET_FW_IP_PROTOCOL_; Enabled: Boolean): HRESULT;
var
  FwMgrDisp: IDispatch;
  FwMgr: INetFwMgr;
  FwProfile: INetFwProfile;
  FwOpenPort: INetFwOpenPort;
  FwOpenPortInstances: IEnumVariant;
  TempFwPortObj: OleVariant;
  TempObjValue: Cardinal;
  EnumerateNext: Boolean;
begin
  Result := S_FALSE;
  EnumerateNext := True;

  try
    FwMgrDisp := CreateOleObject(FW_MGR_CLASS_NAME);
    try
     FwMgr := INetFwMgr(FwMgrDisp);

     FwProfile := FwMgr.LocalPolicy.CurrentProfile;
     FwOpenPortInstances := FwProfile.GloballyOpenPorts.Get__NewEnum as IEnumVariant;

     while EnumerateNext do
       if FwOpenPortInstances.Next(1, TempFwPortObj, TempObjValue) <> 0 then
         EnumerateNext := False
       else
       begin
         FwOpenPort := IUnknown(TempFwPortObj) as INetFwOpenPort;

         if (FwOpenPort.Port = Port) and (FwOpenPort.Protocol = Protocol) then
         begin
           FwOpenPort.Enabled := Enabled;
           EnumerateNext := False;
           Result := S_OK;
         end;
       end;

    finally
     FwMgrDisp := Unassigned;
    end;
  except
    on E:EOleSysError do
      Result := E.ErrorCode;
  end;
end;

function EnableDisableApplication(BinaryPath: String; Enabled: Boolean): HRESULT;
var
  FwMgrDisp: IDispatch;
  FwMgr: INetFwMgr;
  FwProfile: INetFwProfile;
  FwApp: INetFwAuthorizedApplication;
  FwAppInstances: IEnumVariant;
  TempFwApp: OleVariant;
  TempObjValue: Cardinal;
  EnumerateNext: Boolean;
begin
  Result := S_FALSE;
  EnumerateNext := True;

  try
    FwMgrDisp := CreateOleObject(FW_MGR_CLASS_NAME);
    try
      FwMgr := INetFwMgr(FwMgrDisp);

      FwProfile := FwMgr.LocalPolicy.CurrentProfile;
      FwAppInstances := FwProfile.AuthorizedApplications.Get__NewEnum as IEnumVariant;

      while EnumerateNext do
       if FwAppInstances.Next(1, TempFwApp, TempObjValue) <> 0 then
         EnumerateNext := False
       else
       begin
         FwApp := IUnknown(TempFwApp) as INetFwAuthorizedApplication;

         if FwApp.ProcessImageFileName = BinaryPath then
         begin
           FwApp.Enabled := Enabled;
           EnumerateNext := False;
           Result := S_OK;
         end;

       end;

    finally
      FwMgrDisp := Unassigned;
    end;
  except
    on E:EOleSysError do
      Result := E.ErrorCode;
  end;
end;

function IsFirewallEnabled(var Enabled: Boolean): HRESULT;
var
  FwMgrDisp: IDispatch;
  FwMgr: INetFwMgr;
  FwProfile: INetFwProfile;
begin
  Result := S_OK;

  try
    FwMgrDisp := CreateOleObject(FW_MGR_CLASS_NAME);
    try
     FwMgr := INetFwMgr(FwMgrDisp);

     FwProfile := FwMgr.LocalPolicy.CurrentProfile;
     Enabled := FwProfile.FirewallEnabled
    finally
     FwMgrDisp := Unassigned;
    end;
  except
    on E:EOleSysError do
      Result := E.ErrorCode;
  end;
end;

function EnableDisableFirewall(Enabled: Boolean): HRESULT;
var
  FwMgrDisp: IDispatch;
  FwMgr: INetFwMgr;
  FwProfile: INetFwProfile;
begin
  Result := S_OK;

  try
    FwMgrDisp := CreateOleObject(FW_MGR_CLASS_NAME);
    try
     FwMgr := INetFwMgr(FwMgrDisp);

     FwProfile := FwMgr.LocalPolicy.CurrentProfile;
     FwProfile.FirewallEnabled := Enabled;
    finally
     FwMgrDisp := Unassigned;
    end;
  except
    on E:EOleSysError do
      Result := E.ErrorCode;
  end;
end;

function AllowDisallowExceptionsNotAllowed(NotAllowed: Boolean): HRESULT;
var
  FwMgrDisp: IDispatch;
  FwMgr: INetFwMgr;
  FwProfile: INetFwProfile;
begin
  Result := S_OK;

  try
    FwMgrDisp := CreateOleObject(FW_MGR_CLASS_NAME);
    try
     FwMgr := INetFwMgr(FwMgrDisp);

     FwProfile := FwMgr.LocalPolicy.CurrentProfile;
     FwProfile.ExceptionsNotAllowed := NotAllowed;
    finally
     FwMgrDisp := Unassigned;
    end;
  except
    on E:EOleSysError do
      Result := E.ErrorCode;
  end;
end;

function AreExceptionsNotAllowed(var NotAllowed: Boolean): HRESULT;
var
  FwMgrDisp: IDispatch;
  FwMgr: INetFwMgr;
  FwProfile: INetFwProfile;
begin
  Result := S_OK;

  try
    FwMgrDisp := CreateOleObject(FW_MGR_CLASS_NAME);
    try
     FwMgr := INetFwMgr(FwMgrDisp);

     FwProfile := FwMgr.LocalPolicy.CurrentProfile;
     NotAllowed := FwProfile.ExceptionsNotAllowed;
    finally
     FwMgrDisp := Unassigned;
    end;
  except
    on E:EOleSysError do
      Result := E.ErrorCode;
  end;
end;

function EnableDisableNotifications(Enabled: Boolean): HRESULT;
var
  FwMgrDisp: IDispatch;
  FwMgr: INetFwMgr;
  FwProfile: INetFwProfile;
begin
  Result := S_OK;

  try
    FwMgrDisp := CreateOleObject(FW_MGR_CLASS_NAME);
    try
     FwMgr := INetFwMgr(FwMgrDisp);

     FwProfile := FwMgr.LocalPolicy.CurrentProfile;
     FwProfile.NotificationsDisabled := not Enabled;
    finally
     FwMgrDisp := Unassigned;
    end;
  except
    on E:EOleSysError do
      Result := E.ErrorCode;
  end;
end;

function AreNotificationsEnabled(var Enabled: Boolean): HRESULT;
var
  FwMgrDisp: IDispatch;
  FwMgr: INetFwMgr;
  FwProfile: INetFwProfile;
begin
  Result := S_OK;

  try
    FwMgrDisp := CreateOleObject(FW_MGR_CLASS_NAME);
    try
     FwMgr := INetFwMgr(FwMgrDisp);

     FwProfile := FwMgr.LocalPolicy.CurrentProfile;
     Enabled := not FwProfile.NotificationsDisabled;
    finally
     FwMgrDisp := Unassigned;
    end;
  except
    on E:EOleSysError do
      Result := E.ErrorCode;
  end;
end;

function IsFirwallServiceRunning(var IsRunning: Boolean): Boolean;
begin
  IsRunning := False;

  try
    if ServiceControl.ExistsService(FW_SERVICE_VISTA) then
      if ServiceControl.ServiceIsRunning(FW_SERVICE_VISTA, IsRunning) then
      begin
        Result := True;
        Exit;
      end;

    if ServiceControl.ExistsService(FW_SERVICE_XP_WIN2003) then
      if ServiceControl.ServiceIsRunning(FW_SERVICE_XP_WIN2003, IsRunning) then
      begin
        Result := True;
        Exit;
      end;

    Result := True;
  except
    Result := False;
  end;
end;

function StartStopFirewallService(Enabled: Boolean): Boolean;
begin
  Result := False;

  try
    if ServiceControl.ExistsService(FW_SERVICE_VISTA) then
    begin
      if Enabled then
      begin
        if ServiceControl.StartService(FW_SERVICE_VISTA) then
        begin
          Result := True;
          Exit;
        end;
      end
      else
        if ServiceControl.StopService(FW_SERVICE_VISTA) then
        begin
          Result := True;
          Exit;
        end;
    end;

    if ServiceControl.ExistsService(FW_SERVICE_XP_WIN2003) then
    begin
      if Enabled then
      begin
        if ServiceControl.StartService(FW_SERVICE_XP_WIN2003) then
        begin
          Result := True;
          Exit;
        end;
      end
      else
        if ServiceControl.StopService(FW_SERVICE_XP_WIN2003) then
        begin
          Result := True;
          Exit;
        end;
    end;

  except
    Result := False;
  end;

end;

end.
