@echo off
setlocal enabledelayedexpansion

# Define the array of dataset names
set dataset_names=multiarith gsm8k singleeq addsub aqua svamp commonsensqa strategyqa last_letters coin_flip
set model_name=gpt-3.5-turbo-0301

# Loop over dataset names
for %%d in (%dataset_names%) do (
    python zero_shot_cot.py >> log/%%d_%model_name%_zero_shot_cot.log ^
        --dataset %%d ^
        --method zero_shot_cot ^
        --model %model_name% ^
        --limit_dataset_size 0
)

endlocal