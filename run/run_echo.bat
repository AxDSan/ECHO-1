@echo off
set dataset_name=commonsensqa
set model_name=gpt-3.5-turbo-0301
set ECHO_model_name=gpt-3.5-turbo-0301
set num_clusters=8
set iter_ECHO=2

REM step 3: generate the ECHO demo
python run_ECHO.py ^
--dataset %dataset_name% ^
--method auto_cot ^
--demo_path demos/%dataset_name%_%model_name%_%num_clusters% ^
--output_dir ECHO_demos/%dataset_name%_%ECHO_model_name%_%num_clusters%_%iter_ECHO% ^
--iter %iter_ECHO% ^
--model %ECHO_model_name%

REM sleep 2

REM # step 4: inference and evaluate
REM python run_inference.py ^
REM --dataset %dataset_name% ^
REM --demo_path ECHO_demos/%dataset_name%_%ECHO_model_name%_%num_clusters%_%iter_ECHO% ^
REM --output_dir experiment/%dataset_name%_%model_name%_%num_clusters%_%iter_ECHO% ^
REM --method auto_cot ^
REM --model %model_name%