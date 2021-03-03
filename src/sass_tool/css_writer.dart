import 'dart:io';
import 'package:logging/logging.dart';
import 'logger.dart';


abstract class CssFileSink {
  Future<IOSink> writeToFileAsync(String css, String cssFilePath);
}

class CssWriter extends CssFileSink {
  final BaseLogger logger;

  CssWriter({this.logger}) {
    logger.loggerName = runtimeType.toString();
  }

  @override
  Future<IOSink> writeToFileAsync(String css, String cssFilePath) async {
    final outPut = File(cssFilePath).openWrite();
    outPut.write(css);
    await outPut.flush();
    logger.log(Level.INFO, 'scss transpiled successfully');
    return outPut;
  }
}
