import 'dart:io';

import 'package:logging/logging.dart';
import 'package:path/path.dart' as p;
import 'package:rxdart/rxdart.dart';
import 'package:sass/sass.dart' as sass;
import 'package:watcher/watcher.dart';

import 'css_writer.dart';
import 'logger.dart';

class SassWatcher {
  IOSink _ioSink;
  String _scssFilePath;
  Stream<WatchEvent> _sassStream;
  Stream<ProcessSignal> _processStream;

  final String cssDirectoryName, cssFileName;
  final BaseLogger logger;

  SassWatcher(this.cssDirectoryName, this.cssFileName, {this.logger}) {
    logger.loggerName = runtimeType.toString();
  }

  Future<void> buildWatcherStreamsAsync(
      String scssDirectoryName, String scssFileName) async {
    _sassStream = DirectoryWatcher(scssDirectoryName).events;
    _scssFilePath = p.join(scssDirectoryName, scssFileName);
    _processStream = ProcessSignal.sigint.watch();
  }

  void watch(CssFileSink cssFileSink) {
    logger.log(Level.INFO, 'Watching sass compilation...');

    final subs = _sassStream.switchMap((WatchEvent event) {
      if (event.type.toString().contains('modify')) {
        final css = sass.compile(_scssFilePath);
        cssFileSink
            .writeToFileAsync(css, p.join(cssDirectoryName, cssFileName))
            .then((value) => _ioSink = value);
      }
      return _processStream;
    }).listen((_) {}, onError: (e) {
      logger.log(Level.SEVERE, 'Scss compilation error:\n ${e}');
    });

    subs.onData((ProcessSignal data) {
      logger.log(Level.INFO, 'Closing css file...');
      _ioSink.close();
      logger.log(Level.INFO, 'Shutting down process...');
      subs.cancel();
      logger.log(Level.INFO, 'Done.');
    });
  }
}
