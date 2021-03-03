import 'css_writer.dart';
import 'logger.dart';
import 'sass_watcher.dart';

/*
* Transpile SCSS files to CSS
* The command line arguments must be in the following order:
*   - The absolute directory path at which the ".scss" file is in
*   - The name of the ".scss" file to watch
*   - The absolute directory path in which the ".css" file should be written on
*   - The name of ".css" file to write the transpiled ".scss" file on
*/
Future<void> main(List<String> args) async {
  final scssDirectoryName = args[0];
  final scssFileName = args[1];
  final cssDirectoryName = args[2];
  final cssFileName = args[3];

  final logger = DefaultLogger();
  final sassWatcher =
      SassWatcher(cssDirectoryName, cssFileName, logger: logger);
  await sassWatcher.buildWatcherStreamsAsync(scssDirectoryName, scssFileName);
  sassWatcher.watch(CssWriter(logger: logger));
}
