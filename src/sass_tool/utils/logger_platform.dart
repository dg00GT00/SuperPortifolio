import 'dart:io' show Platform;

mixin _Colors {
  static const RED = '\u001b[31m';
  static const GREEN = '\u001b[32m';
  static const RESET = '\u001b[0m';
}

String generateColorMessage(String message, String color) {
  return '${color}${message}${_Colors.RESET}';
}

class _LogContext {
  _LogState _state;

  _LogContext(_LogState state) {
    transitionTo(state);
  }

  void transitionTo(_LogState state) {
    _state = state;
    _state.setContext(this);
  }

  void generateLogByPlatform() {
    _state.logLevelByPlatform();
  }

  String getLogMessage(String logLevel) {
    _state.logLevel = logLevel;
    _state.logLevelByPlatform();
    return _state.logMessage;
  }
}

abstract class _LogState {
  String logLevel;
  String logMessage;
  _LogContext context;
  void setContext(_LogContext context) {
    this.context = context;
  }

  void logLevelByPlatform();
}

class _PlatformLogMessage extends _LogState {
  @override
  void logLevelByPlatform() {
    final os = Platform.operatingSystem;
    switch (os) {
      case 'linux':
        context.transitionTo(_LinuxLogMessage());
        break;
      default:
        context.transitionTo(_DefaultLogMessage());
    }
  }
}

class _DefaultLogMessage extends _LogState {
  @override
  void logLevelByPlatform() {
    logMessage = '[${logLevel}]';
  }
}

class _LinuxLogMessage extends _LogState {
  @override
  void logLevelByPlatform() {
    switch (logLevel) {
      case 'INFO':
        logMessage = generateColorMessage('[INFO]', _Colors.GREEN);
        break;
      case 'SEVERE':
        logMessage = generateColorMessage('[SEVERE]', _Colors.RED);
        break;
      default:
        logMessage = '[${logLevel}]';
    }
  }
}

class ColorLog {
  _LogContext _logConfig;
  ColorLog() {
    _logConfig = _LogContext(_PlatformLogMessage());
    _logConfig.generateLogByPlatform();
  }

  String getColoredLog(String logLevel) {
    return _logConfig.getLogMessage(logLevel);
  }
}