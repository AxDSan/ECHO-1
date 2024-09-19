@echo off
set dataset_name=coin_flip
set model_name=gpt-3.5-turbo-0301
set num_clusters=32
set iter_CAT=3

REM step 3: generate the CAT demo
python run_ECHO_max.py ^
--dataset %dataset_name% ^
--method auto_cot ^
--demo_path demos/%dataset_name%_%model_name% ^
--output_dir ECHO_demos/%dataset_name%_%model_name%_max ^
--model %model_name%

timeout /t 2 /nobreak

REM # step 4: inference and evaluate
REM python run_inference.py ^
REM --dataset %dataset_name% ^
REM --demo_path ECHO_demos/%dataset_name%_%model_name%_max ^
REM --output_dir experiment/%dataset_name%_%model_name%_%num_clusters%_max ^
REM --method auto_cot ^
REM --model %model_name%