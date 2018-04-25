library SimpleFC;

uses
  NSIS, Windows, FirewallControl, SysUtils;

function ResultToStr(Value: Boolean): String;
begin
  if Value then
    result := '0'
  else
    result := '1';
end;

function BoolToStr(Value: Boolean): String;
begin
  if Value then
    result := '1'
  else
    result := '0';
end;

function StrToBool(Value: String): Boolean;
begin
  if Value = '1' then
    result := True
  else
    result := False;
end;

procedure AddPort(const hwndParent: HWND; const string_size: integer;
  const variables: PChar; const stacktop: pointer); cdecl;
var
  Port: Integer;
  Name: String;
  Protocol: Integer;
  Scope: Integer;
  Enabled: Boolean;
  IpVersion: Integer;
  RemoteAddresses: String;
  FirewallResult: String;
begin
  Init(hwndParent, string_size, variables, stacktop);

  Port := StrToInt(PopString);
  Name := PopString;
  Protocol := StrToInt(PopString);
  Scope := StrToInt(PopString);
  IpVersion := StrToInt(PopString);
  RemoteAddresses := PopString;
  Enabled := StrToBool(PopString);

  FirewallResult := ResultToStr(FirewallControl.AddPort(Port, Name, Protocol, Scope, IpVersion, RemoteAddresses, Enabled) = 0);
  PushString(FirewallResult);
end;

procedure RemovePort(const hwndParent: HWND; const string_size: integer;
  const variables: PChar; const stacktop: pointer); cdecl;
var
  Port: Integer;
  Protocol: Integer;
  FirewallResult: String;
begin
  Init(hwndParent, string_size, variables, stacktop);

  Port := StrToInt(PopString);
  Protocol := StrToInt(PopString);

  FirewallResult := ResultToStr(FirewallControl.RemovePort(Port, Protocol) = 0);
  PushString(FirewallResult);
end;

procedure AddApplication(const hwndParent: HWND; const string_size: integer;
  const variables: PChar; const stacktop: pointer); cdecl;
var
  Name: String;
  BinaryPath: String;
  IpVersion: Integer;
  Scope: Integer;
  RemoteAdresses: String;
  Enabled: Boolean;
  FirewallResult: String;
begin
  Init(hwndParent, string_size, variables, stacktop);

  Name := PopString;
  BinaryPath := PopString;
  IpVersion := StrToInt(PopString);
  Scope := StrToInt(PopString);
  RemoteAdresses := PopString;
  Enabled := StrToBool(PopString);

  FirewallResult := ResultToStr(FirewallControl.AddApplication(Name, BinaryPath, IpVersion, Scope, RemoteAdresses, Enabled) = 0);
  PushString(FirewallResult);
end;

procedure RemoveApplication(const hwndParent: HWND; const string_size: integer;
  const variables: PChar; const stacktop: pointer); cdecl;
var
  BinaryPath: String;
  FirewallResult: String;
begin
  Init(hwndParent, string_size, variables, stacktop);

  BinaryPath := PopString;

  FirewallResult := ResultToStr(FirewallControl.RemoveApplication(BinaryPath) = 0);
  PushString(FirewallResult);
end;

procedure IsPortAdded(const hwndParent: HWND; const string_size: integer;
  const variables: PChar; const stacktop: pointer); cdecl;
var
  Port: Integer;
  Protocol: Integer;
  Added: Boolean;
  FirewallResult: String;
begin
  Init(hwndParent, string_size, variables, stacktop);

  Port := StrToInt(PopString);
  Protocol := StrToInt(PopString);

  FirewallResult := ResultToStr(FirewallControl.IsPortAdded(Port, Protocol, Added) = 0);
  PushString(BoolToStr(Added));
  PushString(FirewallResult);
end;

procedure IsApplicationAdded(const hwndParent: HWND; const string_size: integer;
  const variables: PChar; const stacktop: pointer); cdecl;
var
  BinaryPath: String;
  Added: Boolean;
  FirewallResult: String;
begin
  Init(hwndParent, string_size, variables, stacktop);

  BinaryPath := PopString;

  FirewallResult := ResultToStr(FirewallControl.IsApplicationAdded(BinaryPath, Added) = 0);
  PushString(BoolToStr(Added));
  PushString(FirewallResult);
end;

procedure IsPortEnabled(const hwndParent: HWND; const string_size: integer;
  const variables: PChar; const stacktop: pointer); cdecl;
var
  Port: Integer;
  Protocol: Integer;
  Enabled: Boolean;
  FirewallResult: String;
begin
  Init(hwndParent, string_size, variables, stacktop);

  Port := StrToInt(PopString);
  Protocol := StrToInt(PopString);

  FirewallResult := ResultToStr(FirewallControl.IsPortEnabled(Port, Protocol, Enabled) = 0);
  PushString(BoolToStr(Enabled));
  PushString(FirewallResult);
end;

procedure IsApplicationEnabled(const hwndParent: HWND; const string_size: integer;
  const variables: PChar; const stacktop: pointer); cdecl;
var
  BinaryPath: String;
  Enabled: Boolean;
  FirewallResult: String;
begin
  Init(hwndParent, string_size, variables, stacktop);

  BinaryPath := PopString;

  FirewallResult := ResultToStr(FirewallControl.IsApplicationEnabled(BinaryPath, Enabled) = 0);
  PushString(BoolToStr(Enabled));
  PushString(FirewallResult);
end;

procedure EnableDisablePort(const hwndParent: HWND; const string_size: integer;
  const variables: PChar; const stacktop: pointer); cdecl;
var
  Port: Integer;
  Protocol: Integer;
  Enabled: Boolean;
  FirewallResult: String;
begin
  Init(hwndParent, string_size, variables, stacktop);

  Port := StrToInt(PopString);
  Protocol := StrToInt(PopString);
  Enabled := StrToBool(PopString);

  FirewallResult := ResultToStr(FirewallControl.EnableDisablePort(Port, Protocol, Enabled) = 0);
  PushString(FirewallResult);
end;

procedure EnableDisableApplication(const hwndParent: HWND; const string_size: integer;
  const variables: PChar; const stacktop: pointer); cdecl;
var
  BinaryPath: String;
  Enabled: Boolean;
  FirewallResult: String;
begin
  Init(hwndParent, string_size, variables, stacktop);

  BinaryPath := PopString;
  Enabled := StrToBool(PopString);

  FirewallResult := ResultToStr(FirewallControl.EnableDisableApplication(BinaryPath, Enabled) = 0);
  PushString(FirewallResult);
end;

procedure IsFirewallEnabled(const hwndParent: HWND; const string_size: integer;
  const variables: PChar; const stacktop: pointer); cdecl;
var
  Enabled: Boolean;
  FirewallResult: String;
begin
  Init(hwndParent, string_size, variables, stacktop);

  FirewallResult := ResultToStr(FirewallControl.IsFirewallEnabled(Enabled) = 0);
  PushString(BoolToStr(Enabled));
  PushString(FirewallResult);
end;

procedure EnableDisableFirewall(const hwndParent: HWND; const string_size: integer;
  const variables: PChar; const stacktop: pointer); cdecl;
var
  Enabled: Boolean;
  FirewallResult: String;
begin
  Init(hwndParent, string_size, variables, stacktop);

  Enabled := StrToBool(PopString);

  FirewallResult := ResultToStr(FirewallControl.EnableDisableFirewall(Enabled) = 0);
  PushString(FirewallResult);
end;

procedure AllowDisallowExceptionsNotAllowed(const hwndParent: HWND; const string_size: integer;
  const variables: PChar; const stacktop: pointer); cdecl;
var
  NotAllowed: Boolean;
  FirewallResult: String;
begin
  Init(hwndParent, string_size, variables, stacktop);

  NotAllowed := StrToBool(PopString);

  FirewallResult := ResultToStr(FirewallControl.AllowDisallowExceptionsNotAllowed(NotAllowed) = 0);
  PushString(FirewallResult);
end;

procedure AreExceptionsNotAllowed(const hwndParent: HWND; const string_size: integer;
  const variables: PChar; const stacktop: pointer); cdecl;
var
  NotAllowed: Boolean;
  FirewallResult: String;
begin
  Init(hwndParent, string_size, variables, stacktop);

  FirewallResult := ResultToStr(FirewallControl.AreExceptionsNotAllowed(NotAllowed) = 0);
  PushString(BoolToStr(NotAllowed));
  PushString(FirewallResult);
end;

procedure EnableDisableNotifications(const hwndParent: HWND; const string_size: integer;
  const variables: PChar; const stacktop: pointer); cdecl;
var
  Enabled: Boolean;
  FirewallResult: String;
begin
  Init(hwndParent, string_size, variables, stacktop);

  Enabled := StrToBool(PopString);

  FirewallResult := ResultToStr(FirewallControl.EnableDisableNotifications(Enabled) = 0);
  PushString(BoolToStr(Enabled));
  PushString(FirewallResult);
end;

procedure AreNotificationsEnabled(const hwndParent: HWND; const string_size: integer;
  const variables: PChar; const stacktop: pointer); cdecl;
var
  Enabled: Boolean;
  FirewallResult: String;
begin
  Init(hwndParent, string_size, variables, stacktop);

  FirewallResult := ResultToStr(FirewallControl.AreNotificationsEnabled(Enabled) = 0);
  PushString(BoolToStr(Enabled));
  PushString(FirewallResult);
end;

procedure StartStopFirewallService(const hwndParent: HWND; const string_size: integer;
  const variables: PChar; const stacktop: pointer); cdecl;
var
  Enabled: Boolean;
  FirewallResult: String;
begin
  Init(hwndParent, string_size, variables, stacktop);

  Enabled := StrToBool(PopString);

  FirewallResult := ResultToStr(FirewallControl.StartStopFirewallService(Enabled));
  PushString(FirewallResult);
end;

procedure IsFirewallServiceRunning(const hwndParent: HWND; const string_size: integer;
  const variables: PChar; const stacktop: pointer); cdecl;
var
  IsRunning: Boolean;
  FirewallResult: String;
begin
  Init(hwndParent, string_size, variables, stacktop);

  FirewallResult := ResultToStr(FirewallControl.IsFirwallServiceRunning(IsRunning));
  PushString(BoolToStr(IsRunning));
  PushString(FirewallResult);
end;

exports AddPort;
exports RemovePort;
exports AddApplication;
exports RemoveApplication;
exports IsPortAdded;
exports IsApplicationAdded;
exports IsPortEnabled;
exports IsApplicationEnabled;
exports EnableDisablePort;
exports EnableDisableApplication;
exports IsFirewallEnabled;
exports EnableDisableFirewall;
exports AllowDisallowExceptionsNotAllowed;
exports AreExceptionsNotAllowed;
exports EnableDisableNotifications;
exports AreNotificationsEnabled;
exports StartStopFirewallService;
exports IsFirewallServiceRunning;

end.
