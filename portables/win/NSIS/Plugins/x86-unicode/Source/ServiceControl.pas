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

The original code is ServiceControl.pas, released April 16, 2007.

The initial developer of the original code is Rainer Budde (http://www.speed-soft.de). 

SimpleSC - NSIS Service Control Plugin is written, published and maintaned by
Rainer Budde (rainer@speed-soft.de).
}
unit ServiceControl;

interface

uses
  Windows, WinSvc, SysUtils;

  function InstallService(ServiceName, DisplayName: String; StartType: DWORD; BinaryPathName: String; Dependencies: String; Username: String; Password: String): Boolean;
  function RemoveService(ServiceName: String): Boolean;
  function StartService(ServiceName: String): Boolean;
  function StopService(ServiceName: String): Boolean;
  function PauseService(ServiceName: String): Boolean;
  function ContinueService(ServiceName: String): Boolean;
  function GetServiceName(DisplayName: String; var Name: String): Boolean;
  function GetServiceDisplayName(ServiceName: String; var Name: String): Boolean;
  function GetServiceStatus(ServiceName: String; var Status: DWORD): Boolean;
  function GetServiceStartType(ServiceName: String; var StartType: DWORD): Boolean;
  function GetServiceDescription(ServiceName: String; var Description: String): Boolean;
  function SetServiceStartType(ServiceName: String; StartType: DWORD): Boolean;
  function SetServiceDescription(ServiceName: String; Description: String): Boolean;
  function SetServiceLogon(ServiceName: String; Username: String; Password: String): Boolean;
  function ServiceIsRunning(ServiceName: String; var IsRunning: Boolean): Boolean;
  function ServiceIsStopped(ServiceName: String; var IsStopped: Boolean): Boolean;
  function ServiceIsPaused(ServiceName: String; var IsPaused: Boolean): Boolean;
  function RestartService(ServiceName: String): Boolean;
  function ExistsService(ServiceName: String): Boolean;

implementation

function ExistsService(ServiceName: String): Boolean;
var
  ManagerHandle: SC_HANDLE;
  ServiceHandle: SC_HANDLE;
begin
  Result := False;

  ManagerHandle := OpenSCManager('', nil, SC_MANAGER_CONNECT);

  if ManagerHandle > 0 then
    begin
      ServiceHandle := OpenService(ManagerHandle, PChar(ServiceName), SERVICE_START);

      if ServiceHandle > 0 then
        begin
          Result := True;
          CloseServiceHandle(ServiceHandle);
        end;

      CloseServiceHandle(ManagerHandle);
    end;
end;

function StartService(ServiceName: String): Boolean;
var
  ManagerHandle: SC_HANDLE;
  ServiceHandle: SC_HANDLE;
  ServiceArgVectors: PChar;
  IsRunning: Boolean;
begin
  Result := False;
  IsRunning := False;

  ManagerHandle := OpenSCManager('', nil, SC_MANAGER_CONNECT);

  if ManagerHandle > 0 then
    begin
      ServiceHandle := OpenService(ManagerHandle, PChar(ServiceName), SERVICE_START);

      if ServiceHandle > 0 then
        begin
          ServiceArgVectors := '';
          Result := WinSvc.StartService(ServiceHandle, 0, ServiceArgVectors);

          if Result then
            while NOT IsRunning do
            begin
              ServiceIsRunning(ServiceName, IsRunning);
              Sleep(100);
            end;

          CloseServiceHandle(ServiceHandle);
        end;

      CloseServiceHandle(ManagerHandle);
    end;
end;

function StopService(ServiceName: String): Boolean;
var
  ManagerHandle: SC_HANDLE;
  ServiceHandle: SC_HANDLE;
  ServiceStatus: TServiceStatus;
  IsStopped: Boolean;
begin
  Result := False;
  IsStopped := False;

  ManagerHandle := OpenSCManager('', nil, SC_MANAGER_CONNECT);

  if ManagerHandle > 0 then
    begin
      ServiceHandle := OpenService(ManagerHandle, PChar(ServiceName), SERVICE_ALL_ACCESS);

      if ServiceHandle > 0 then
        begin
          Result := ControlService(ServiceHandle, SERVICE_CONTROL_STOP, ServiceStatus);

          if Result then
            while NOT IsStopped do
            begin
              ServiceIsStopped(ServiceName, IsStopped);
              Sleep(100);
            end;

          CloseServiceHandle(ServiceHandle);
        end;

      CloseServiceHandle(ManagerHandle);
    end;    
end;

function PauseService(ServiceName: String): Boolean;
var
  ManagerHandle: SC_HANDLE;
  ServiceHandle: SC_HANDLE;
  ServiceStatus: TServiceStatus;
  IsPaused: Boolean;
begin
  Result := False;
  IsPaused := False;

  ManagerHandle := OpenSCManager('', nil, SC_MANAGER_CONNECT);

  if ManagerHandle > 0 then
    begin
      ServiceHandle := OpenService(ManagerHandle, PChar(ServiceName), SERVICE_PAUSE_CONTINUE);

      if ServiceHandle > 0 then
        begin
          Result := ControlService(ServiceHandle, SERVICE_CONTROL_PAUSE, ServiceStatus);

          if Result then
            while NOT IsPaused do
            begin
              ServiceIsPaused(ServiceName, IsPaused);
              Sleep(100);
            end;

          CloseServiceHandle(ServiceHandle);
        end;

      CloseServiceHandle(ManagerHandle);
    end;
end;

function ContinueService(ServiceName: String): Boolean;
var
  ManagerHandle: SC_HANDLE;
  ServiceHandle: SC_HANDLE;
  ServiceStatus: TServiceStatus;
  IsRunning: Boolean;
begin
  Result := False;
  IsRunning := False;

  ManagerHandle := OpenSCManager('', nil, SC_MANAGER_CONNECT);

  if ManagerHandle > 0 then
    begin
      ServiceHandle := OpenService(ManagerHandle, PChar(ServiceName), SERVICE_PAUSE_CONTINUE);

      if ServiceHandle > 0 then
        begin
          Result := ControlService(ServiceHandle, SERVICE_CONTROL_CONTINUE, ServiceStatus);

          if Result then
            while NOT IsRunning do
            begin
              ServiceIsRunning(ServiceName, IsRunning);
              Sleep(100);
            end;

          CloseServiceHandle(ServiceHandle);
        end;

      CloseServiceHandle(ManagerHandle);
    end;
end;

function GetServiceName(DisplayName: String; var Name: String): Boolean;
var
  ManagerHandle: SC_HANDLE;
  ServiceName: PChar;
  ServiceBuffer: Cardinal;
begin
  Result := False;

  ServiceBuffer := 255;
  ServiceName := StrAlloc(ServiceBuffer+1);

  ManagerHandle := OpenSCManager('', nil, SC_MANAGER_CONNECT);

  if ManagerHandle > 0 then
    begin
      Result := WinSvc.GetServiceKeyName(ManagerHandle, PChar(DisplayName), ServiceName, ServiceBuffer);
      Name := ServiceName;

      CloseServiceHandle(ManagerHandle);
    end;
end;

function GetServiceDisplayName(ServiceName: String; var Name: String): Boolean;
var
  ManagerHandle: SC_HANDLE;
  DisplayName: PChar;
  ServiceBuffer: Cardinal;
begin
  Result := False;

  ServiceBuffer := 255;
  DisplayName := StrAlloc(ServiceBuffer+1);

  ManagerHandle := OpenSCManager('', nil, SC_MANAGER_CONNECT);

  if ManagerHandle > 0 then
    begin
      Result := WinSvc.GetServiceDisplayName(ManagerHandle, PChar(ServiceName), DisplayName, ServiceBuffer);
      Name := DisplayName;

      CloseServiceHandle(ManagerHandle);
    end;
end;

function GetServiceStatus(ServiceName: String; var Status: DWORD): Boolean;
var
  ManagerHandle: SC_HANDLE;
  ServiceHandle: SC_HANDLE;
  ServiceStatus: TServiceStatus;
begin
  Result := False;

  ManagerHandle := OpenSCManager('', nil, SC_MANAGER_CONNECT);

  if ManagerHandle > 0 then
    begin
      ServiceHandle := OpenService(ManagerHandle, PChar(ServiceName), SERVICE_QUERY_STATUS);

      if ServiceHandle > 0 then
        begin
          Result := QueryServiceStatus(ServiceHandle, ServiceStatus);
          Status := ServiceStatus.dwCurrentState;

          CloseServiceHandle(ServiceHandle);
        end;

      CloseServiceHandle(ManagerHandle);
    end;
end;

function GetServiceStartType(ServiceName: String; var StartType: DWORD): Boolean;
var
  ManagerHandle: SC_HANDLE;
  ServiceHandle: SC_HANDLE;
  BytesNeeded: DWORD;
  ServiceConfig: PQueryServiceConfig;
begin
  Result := False;
  ServiceConfig := nil;

  ManagerHandle := OpenSCManager('', nil, SC_MANAGER_CONNECT);

  if ManagerHandle > 0 then
    begin
      ServiceHandle := OpenService(ManagerHandle, PChar(ServiceName), SERVICE_QUERY_CONFIG);

      if ServiceHandle > 0 then
        begin
          QueryServiceConfig(ServiceHandle, ServiceConfig, 0, BytesNeeded);
          GetMem(ServiceConfig, BytesNeeded);
          Result := QueryServiceConfig(ServiceHandle, ServiceConfig, BytesNeeded, BytesNeeded);

          if Result then
            StartType := ServiceConfig^.dwStartType;

          FreeMem(ServiceConfig);
            
          CloseServiceHandle(ServiceHandle);
        end;

      CloseServiceHandle(ManagerHandle);
    end;
end;

function GetServiceDescription(ServiceName: String; var Description: String): Boolean;
const
  SERVICE_CONFIG_DESCRIPTION = 1;
type
  TServiceDescription = record
    lpDescription: PAnsiChar;
  end;
  PServiceDescription = ^TServiceDescription;
var
  QueryServiceConfig2: function(hService: SC_HANDLE; dwInfoLevel: DWORD; pBuffer: Pointer; cbBufSize: DWORD; var cbBytesNeeded: Cardinal): BOOL; stdcall;
  ManagerHandle: SC_HANDLE;
  ServiceHandle: SC_HANDLE;
  LockHandle: SC_LOCK;
  ServiceDescription: PServiceDescription;
  BytesNeeded: Cardinal;
begin
  Result := False;

  ManagerHandle := OpenSCManager('', nil, SC_MANAGER_ALL_ACCESS);

  if ManagerHandle > 0 then
    begin
      ServiceHandle := OpenService(ManagerHandle, PChar(ServiceName), SERVICE_ALL_ACCESS);

      if ServiceHandle > 0 then
        begin
          LockHandle := LockServiceDatabase(ManagerHandle);

          if LockHandle <> nil then
            begin
              @QueryServiceConfig2 := GetProcAddress(GetModuleHandle(advapi32), 'QueryServiceConfig2A');

              if Assigned(@QueryServiceConfig2) then
                begin
                  QueryServiceConfig2(ServiceHandle, SERVICE_CONFIG_DESCRIPTION, nil, 0, BytesNeeded);
                  GetMem(ServiceDescription, BytesNeeded);
                  Result := QueryServiceConfig2(ServiceHandle, SERVICE_CONFIG_DESCRIPTION, ServiceDescription, BytesNeeded, BytesNeeded);

                  if Result then
                    Description := ServiceDescription.lpDescription;

                  FreeMem(ServiceDescription)
                end;

              UnlockServiceDatabase(LockHandle);
            end;

          CloseServiceHandle(ServiceHandle);
        end;

      CloseServiceHandle(ManagerHandle);
    end;
end;


function SetServiceDescription(ServiceName: String; Description: String): Boolean;
const
  SERVICE_CONFIG_DESCRIPTION = 1;
var
  ChangeServiceConfig2: function(hService: SC_HANDLE; dwInfoLevel: DWORD; lpInfo: Pointer): BOOL; stdcall;
  ManagerHandle: SC_HANDLE;
  ServiceHandle: SC_HANDLE;
  LockHandle: SC_LOCK;
begin
  Result := False;

  ManagerHandle := OpenSCManager('', nil, SC_MANAGER_ALL_ACCESS);

  if ManagerHandle > 0 then
    begin
      ServiceHandle := OpenService(ManagerHandle, PChar(ServiceName), SERVICE_ALL_ACCESS);

      if ServiceHandle > 0 then
        begin
          LockHandle := LockServiceDatabase(ManagerHandle);

          if LockHandle <> nil then
            begin
              @ChangeServiceConfig2 := GetProcAddress(GetModuleHandle(advapi32), 'ChangeServiceConfig2A');

              if Assigned(@ChangeServiceConfig2) then
                Result := ChangeServiceConfig2(ServiceHandle, SERVICE_CONFIG_DESCRIPTION, @Description);

              UnlockServiceDatabase(LockHandle);
            end;

          CloseServiceHandle(ServiceHandle);
        end;

      CloseServiceHandle(ManagerHandle);
    end;
end;

function SetServiceStartType(ServiceName: String; StartType: DWORD): Boolean;
var
  ManagerHandle: SC_HANDLE;
  ServiceHandle: SC_HANDLE;
  LockHandle: SC_LOCK;
begin
  Result := False;

  ManagerHandle := OpenSCManager('', nil, SC_MANAGER_ALL_ACCESS);

  if ManagerHandle > 0 then
    begin
      ServiceHandle := OpenService(ManagerHandle, PChar(ServiceName), SERVICE_ALL_ACCESS);

      if ServiceHandle > 0 then
        begin
          LockHandle := LockServiceDatabase(ManagerHandle);

          if LockHandle <> nil then
            begin
              Result := ChangeServiceConfig(ServiceHandle, SERVICE_NO_CHANGE, StartType, SERVICE_NO_CHANGE, nil, nil, nil, nil, nil, nil, nil);
              UnlockServiceDatabase(LockHandle);
            end;

          CloseServiceHandle(ServiceHandle);
        end;

      CloseServiceHandle(ManagerHandle);
    end;
end;

function SetServiceLogon(ServiceName: String; Username: String; Password: String): Boolean;
var
  ManagerHandle: SC_HANDLE;
  ServiceHandle: SC_HANDLE;
  LockHandle: SC_LOCK;
begin
  Result := False;

  ManagerHandle := OpenSCManager('', nil, SC_MANAGER_ALL_ACCESS);

  if ManagerHandle > 0 then
    begin
      ServiceHandle := OpenService(ManagerHandle, PChar(ServiceName), SERVICE_ALL_ACCESS);

      if ServiceHandle > 0 then
        begin
          LockHandle := LockServiceDatabase(ManagerHandle);

          if LockHandle <> nil then
            begin
              Result := ChangeServiceConfig(ServiceHandle, SERVICE_WIN32_OWN_PROCESS, SERVICE_NO_CHANGE, SERVICE_NO_CHANGE, nil, nil, nil, nil, PChar(Username), PChar(Password), nil);
              UnlockServiceDatabase(LockHandle);
            end;

          CloseServiceHandle(ServiceHandle);
        end;

      CloseServiceHandle(ManagerHandle);
    end;
end;

function ServiceIsRunning(ServiceName: String; var IsRunning: Boolean): Boolean;
Var
  Status: DWORD;
begin
  if GetServiceStatus(ServiceName, Status) then
  begin
    IsRunning := Status = SERVICE_RUNNING;
    Result := True;
  end
  else
    Result := False;
end;

function ServiceIsStopped(ServiceName: String; var IsStopped: Boolean): Boolean;
Var
  Status: DWORD;
begin
  if GetServiceStatus(ServiceName, Status) then
  begin
    IsStopped := Status = SERVICE_STOPPED;
    Result := True;
  end
  else
    Result := False;
end;

function ServiceIsPaused(ServiceName: String; var IsPaused: Boolean): Boolean;
Var
  Status: DWORD;
begin
  if GetServiceStatus(ServiceName, Status) then
  begin
    IsPaused := Status = SERVICE_PAUSED;
    Result := True;
  end
  else
    Result := False;
end;

function RestartService(ServiceName: String): Boolean;
begin
  Result := StopService(ServiceName);

  If Result then
    Result := StartService(ServiceName);
end;

function InstallService(ServiceName, DisplayName: String; StartType: DWORD; BinaryPathName: String; Dependencies: String; Username: String; Password: String): Boolean;
var
  ManagerHandle: SC_HANDLE;
  PDependencies: PChar;
  PUsername: PChar;
  PPassword: PChar;
begin
  Result := False;

  if Dependencies = '' then
    PDependencies := nil
  else
    PDependencies := PChar(Dependencies);

  if UserName = '' then
    PUsername := nil
  else
    PUsername := PChar(Username);

  if Password = '' then
    PPassword := nil
  else
    PPassword := PChar(Password);

  ManagerHandle := OpenSCManager('', nil, SC_MANAGER_ALL_ACCESS);

  if ManagerHandle > 0 then
    begin
      Result := CreateService(ManagerHandle,
                              PChar(ServiceName),
                              PChar(DisplayName),
                              SERVICE_START or SERVICE_QUERY_STATUS or _DELETE,
                              SERVICE_WIN32_OWN_PROCESS,
                              StartType,
                              SERVICE_ERROR_NORMAL,
                              PChar(BinaryPathName),
                              nil,
                              nil,
                              PDependencies,
                              PUsername,
                              PPassword) <> 0;

      CloseServiceHandle(ManagerHandle);
    end;
end;


function RemoveService(ServiceName: String): Boolean;
var
  ManagerHandle: SC_HANDLE;
  ServiceHandle: SC_HANDLE;
  LockHandle: SC_LOCK;
  IsStopped: Boolean;
begin
  Result := False;
  IsStopped := False;

  if ServiceIsStopped(ServiceName, IsStopped) then
    if not IsStopped then StopService(ServiceName);

  ManagerHandle := OpenSCManager('', nil, SC_MANAGER_ALL_ACCESS);

  if ManagerHandle > 0 then
    begin
      ServiceHandle := OpenService(ManagerHandle, PChar(ServiceName), SERVICE_ALL_ACCESS);

      if ServiceHandle > 0 then
        begin
          LockHandle := LockServiceDatabase(ManagerHandle);

          if LockHandle <> nil then
            begin
              Result := DeleteService(ServiceHandle);
              UnlockServiceDatabase(LockHandle);
            end;

          CloseServiceHandle(ServiceHandle);
        end;

      CloseServiceHandle(ManagerHandle);
    end;
end;

end.
