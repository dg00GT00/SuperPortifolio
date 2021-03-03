import 'dart:io';

import 'package:path/path.dart' as p;

Future<FileSystemEntity> getDefaultSourceDirectory() async {
  FileSystemEntity sourceDirectory;
  await for (var file in Directory.current.list()) {
    if (file.path.contains('src')) sourceDirectory = file;
    break;
  }
  return sourceDirectory;
}

String createDefaultCssFilePath(Directory cwd, String cssFileName) {
  return p.join(cwd.path, 'web', cssFileName);
}
