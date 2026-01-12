import { Module } from '@nestjs/common';
import { SOSController } from './sos.controller';
import { SOSService } from './sos.service';

@Module({
  controllers: [SOSController],
  providers: [SOSService],
  exports: [SOSService],
})
export class SOSModule {}
